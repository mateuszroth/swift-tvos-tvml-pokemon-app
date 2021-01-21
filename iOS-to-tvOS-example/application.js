//# sourceURL=application.js

//
//  application.js
//  iOS-to-tvOS-example
//
//  Created by Mateusz Roth on 21/01/2021.
//

/*
 * This file provides an example skeletal stub for the server-side implementation 
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is 
 * configured in the AppDelegate of the TVML application. Note that  the various 
 * javascript functions here are referenced by name in the AppDelegate. This skeletal 
 * implementation shows the basic entry points that you will want to handle 
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */
App.onLaunch = function(options) {
    randomPokemon();
}

var randomButton = null;
function clickRandomPokemon() {
    randomButton.disabled = true;
    randomPokemon();
}

function randomPokemon() {
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", "https://pokeapi.co/api/v2/pokemon/" + Math.floor(Math.random() * Math.floor(251)));

    // request state change event
    xhr.onreadystatechange = function() {

        // request completed?
        if (xhr.readyState !== 4) return;

        if (xhr.status === 200) {
            // request successful - show response
            var alert = createAlert(xhr.response);
            randomButton = alert.getElementById("randomPokemon");
            randomButton.disabled = false;
            randomButton.addEventListener("select", randomPokemon);
            navigationDocument.pushDocument(alert);
        } else {
            // request error
            console.log("HTTP error", xhr.status, xhr.statusText);
        }
    };

    // start request
    xhr.send();
}


App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {
    
}

App.onDidBecomeActive = function() {
    
}


/**
 * This convenience function returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(pokemon) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate style="background-color: yellow; color: black;">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="50" height="50" />
            <description>Pokemon App</description>

            <img src="${pokemon.sprites.front_default}" width="300" height="300" style="tv-placeholder:monogram" />
            <title style="font-size: 72">#${pokemon.id} ${pokemon.name.toUpperCase()}</title>
            <description>Types: ${pokemon.types.map(type => type.type.name).join(", ")}</description>
            <description>Weight: ${pokemon.weight}</description>

            <button id="randomPokemon" style="tv-highlight-color: #ff3232; color: #fff">
               <text style="color: #fff">Draw a Pokemon</text>
            </button>
          </alertTemplate>
        </document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");

    return alertDoc
}
