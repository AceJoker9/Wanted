
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }
}


function searchByTrait(people, trait) {
    const traitToSearchFor = prompt(`Please enter the ${trait} you are searching for.`).toLowerCase();
    const traitFilterResults = people.filter(person => person[trait].toLowerCase() === traitToSearchFor);
    return traitFilterResults;
  }


  function searchByTraits(people) {
    let results = people;
  
    // Prompt the user to enter up to five traits to search for
    for (let i = 0; i < 5; i++) {
      const trait = validatedPrompt(`Please enter trait ${i + 1} (or "done" if finished):`, ['done', 'gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation']);
      if (trait === 'done') {
        break;
      }
      const value = trait === 'dob' ? prompt('Please enter the date of birth (mm/dd/yyyy):') : prompt(`Please enter the ${trait}:`);
      results = results.filter(p => p[trait] == value);
    }
  
    return results;
  }



function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
        
        const traitSearchResults = searchByTraits(people);
        if (traitSearchResults.length === 0) {
            alert('No one was found in the search.');
    } else if (traitSearchResults.length === 1) {
        const person = traitSearchResults[0];
            mainMenu(person, people);
    } else {
        let filteredResults = traitSearchResults;
        while (true) {
        const nextFilter = validatedPrompt(`There are ${filteredResults.length} results. Would you like to filter further?`, ['yes', 'no']);
        if (nextFilter === 'no') {
        break;
        }


      filteredResults = searchByTraits(filteredResults);
      if (filteredResults.length === 0) {
        alert('No one was found in the search.');
        break;


      } else if (filteredResults.length === 1) {
        const person = filteredResults[0];
        mainMenu(person, people);
        break;
      }
    }
    if (filteredResults.length > 1) {
      displayPeople('Search Results', filteredResults);
    }
  }
  break;

        const traitToSearchFor = validatedPrompt(
            'Please enter the trait you would like to search by.',
            ['gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation']
          );
          results = searchByTrait(people, traitToSearchFor);

            //! TODO
            results = searchByTrait(people);
            break;
        default:
            return searchPeopleDataSet(people);
    }
    displayPeople(`Search Results for ${traitToSearchFor}:`, searchResults);
    return results;
}

function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            //! TODO
            displayPersonInfo(person);
            break;
        case "family":
            displayImmediateFamily(person, people);
            //! TODO
            // let personFamily = findPersonFamily(person, people);
            // displayPeople('Family', personFamily);
            break;
        case "descendants":
            const personDescendants = findPersonDescendants(person, people);
            displayPeople('Descendants', personDescendants);
            //! TODO
            // let personDescendants = findPersonDescendants(person, people);
            // displayPeople('Descendants', personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}


function displayPersonInfo(person) {
    const personInfo = `ID: ${person.id}\nName: ${person.firstName} ${person.lastName}\nGender: ${person.gender}\nDOB: ${person.dob}\nHeight: ${person.height}\nWeight: ${person.weight}\nEye Color: ${person.eyeColor}\nOccupation: ${person.occupation}`;
    alert(personInfo);
  }


  function findPersonDescendants(person, people) {
    let descendants = [];
  
    // Find all children of the person
    const children = people.filter(p => person.id === p.parents[0] || person.id === p.parents[1]);
  
    // Recursively find all descendants of the person's children
    children.forEach(child => {
      const childDescendants = findPersonDescendants(child, people);
      descendants = descendants.concat(childDescendants);
    });
  
    // Add the person's children and their descendants to the results
    descendants = descendants.concat(children);
  
    return descendants;
  }




  function displayImmediateFamily(person, people) {
    const spouse = people.find(p => p.id === person.currentSpouse);
    const parents = people.filter(p => person.parents.includes(p.id));
    const siblings = people.filter(p => p.parents.includes(person.id) && p.id !== person.id);
    
    let familyInfo = '';
  
    if (spouse) {
      familyInfo += `Spouse: ${spouse.firstName} ${spouse.lastName}\n`;
    }
  
    if (parents.length > 0) {
      familyInfo += `Parents:\n${parents.map(p => `${p.firstName} ${p.lastName}`).join('\n')}\n`;
    }
  
    if (siblings.length > 0) {
      familyInfo += `Siblings:\n${siblings.map(p => `${p.firstName} ${p.lastName}`).join('\n')}\n`;
    }
  
    if (familyInfo === '') {
      alert(`${person.firstName} ${person.lastName} has no immediate family members.`);
    }
    else {
      alert(`${person.firstName} ${person.lastName}'s immediate family:\n\n${familyInfo}`);
    }
  }



function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}