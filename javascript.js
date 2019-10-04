window.onload = function initialisePage() {
	
	//Add tooltip to each field equal to it's ID
	var inputs = document.getElementsByTagName("input")
	for (i = 0; i < inputs.length; i++) {
		inputs[i].title = inputs[i].id;
	}
	
	updateLevel();
	switchTab("core");
}

//Function to update ability scores whenever an ability is updated
function updateAbilities(ability) {
	//	Get current values and calculate the ability modifier (mod)
	var total = parseInt(document.getElementById(ability + "-base").value) + parseInt(document.getElementById(ability + "-bonus").value);
	var mod = Math.floor((parseInt(total) - 10)/2);
	
	//Update total and mod field
	document.getElementById(ability + "-total").value = total;
	document.getElementById(ability + "-mod").value = mod;
	
	//DEBUG alert(ability + " updated. " + total + " : " + mod);
	
	if (ability == document.getElementById("ac-ability").value) {
		updateAC();
	}
	
	if (ability == document.getElementById("hp-ability").value) {
		updateHP();
	}
	
	updateSkills(ability);
}

function updateLevel() {
	//Ensure all ability scores are up to date
	var abilities = ["str","dex","con","int","wis","cha"];
	for (var i = 0; i < abilities.length; i++) {
		updateAbilities(abilities[i]);
	}
	
	//Update other stats
	updateAC();
	updateHP();
	updateSkills("all");
}

function updateAC() {
	
	var acBase = parseInt(document.getElementById("ac-base").value);
	
	//Update AC ability modifier
	var acAbility = document.getElementById("ac-ability").value
	document.getElementById("ac-ability-mod").value = parseInt(document.getElementById(acAbility + "-mod").value);
	
	var acAbilityMod = parseInt(document.getElementById("ac-ability-mod").value);
	var acAbilityFinal = 0;
	
	//Compare the AC ability modifier to the AC cap and return the lowest if the AC cap is set
	if(isNaN(document.getElementById("ac-cap").value)) {
		acAbilityFinal = acAbilityMod;
	} else {
		acAbilityFinal = Math.min(acAbilityMod, parseInt(document.getElementById("ac-cap").value));
	}
	
	//Calculate AC proficiency bonus based on Proficiency bonus + level (or zero if untrained)
	var acProf = 0
	if (parseInt(document.getElementById("ac-prof").value) > 0) {
		var acProf = parseInt(document.getElementById("ac-prof").value) + parseInt(document.getElementById("character-level").value);
	}
	document.getElementById("ac-prof-value").value = acProf;
	
	var acItem = parseInt(document.getElementById("ac-item").value);
	
	var acShield = parseInt(document.getElementById("ac-shield").value);
	
	//Calculate final AC total
	var acTotal = (acBase
		+ acAbilityFinal
		+ acProf
		+ acItem
		+ acShield);
	
	document.getElementById("ac-total").value = acTotal;
}

function updateSection(section) {
	
	var dcBase = parseInt(document.getElementById(section + "-base").value);
	
	//Update DC ability modifier
	var dcAbility = document.getElementById(section + "-ability").value;
	document.getElementById(section + "-ability-mod").value = parseInt(document.getElementById(dcAbility + "-mod").value);
	
	var dcAbilityMod = parseInt(document.getElementById(section + "-ability-mod").value);
	
	//Calculate DC proficiency bonus based on Proficiency bonus + level (or zero if untrained)
	var dcProf = 0
	if (parseInt(document.getElementById(section + "-prof").value) > 0) {
		dcProf = parseInt(document.getElementById(section + "-prof").value) + parseInt(document.getElementById("character-level").value);
	}
	
	document.getElementById(section + "-prof-value").value = dcProf;
	
	var dcItem = parseInt(document.getElementById(section + "-item").value);
	
	var dcArmorPenalty = parseInt(document.getElementById(section + "-armor-penalty").value);
	
	// TODO: Apply Armor Penalty

	//Calculate final DC total
	var dcTotal = (dcBase + dcAbilityMod + dcProf + dcItem + dcArmorPenalty);
	
	document.getElementById(section + "-total").value = dcTotal;
}

function updateHP() {
	//Get modifier for selected HP ability score
	var hpMod = parseInt(document.getElementById(document.getElementById("hp-ability").value + "-mod").value)
	
	//Calculate HP maximum based on class HP and HP mod times level, plus ancestry HP
	var hpTotal = parseInt(document.getElementById("hp-ancestry").value)
		+ ((parseInt(document.getElementById("hp-increment").value) + hpMod)
		* parseInt(document.getElementById("character-level").value));
		
	document.getElementById("hp-max").value = hpTotal;
}

function updateSkills(ability) {
	if (ability == "all") {
		//Get list of skills and loop through them
		var skills = document.querySelectorAll(".skill");
		var i;
		
		for (i = 0; i < skills.length; ++i) {
			var skill = skills[i].id;
			updateSection(skill);
		}
	} else {
		//Get list of skills and loop through them
		var skills = document.querySelectorAll(".skill");
		var i;
		
		for (i = 0; i < skills.length; ++i) {
			//Update skills that use the modified ability
			var skill = skills[i].id;
			var skillAbility = document.getElementById(skill + "-ability").value;
			
			if (skillAbility == ability) {
					updateSection(skill);
			}
		}
	}
}

function rollFor(stat) {
	
	
	if (["str","dex","con","int","wis","cha"].includes(stat)) {
		var statName = document.getElementById(stat + "-button").innerHTML;
		var statTotal = parseInt(document.getElementById(stat + "-mod").value);
	} else if (stat.includes("lore")) {
		alert("Rolled a lore skill");
		var statName = document.getElementById(stat + "-name").value + document.getElementById(stat + "-button").innerHTML;
		var statTotal = parseInt(document.getElementById(stat + "-total").value);
	} else {
		var statName = document.getElementById(stat + "-button").innerHTML;
		var statTotal = parseInt(document.getElementById(stat + "-total").value);
	}
	
	var diceResult = rollDice(1,20)[0];
	var result = diceResult + statTotal;
	var rollDescription = "Rolled: 1d20 (" + diceResult + ") + total " + stat + " modifier (" + statTotal + ") = " + result + ".";
	//DEBUG alert("Rolled " + statName + ": " + result + " (" + diceResult + " + " + statTotal + ")");
	
	document.getElementById("roll-name").value = statName;
	document.getElementById("roll-result").value = result;
	document.getElementById("roll-description").textContent = rollDescription;
}

function rollDice(dice, sides) {
	var results = [];
	for (var i = 0; i < dice; i++) {
  		results[i] = rollSingleDice(1, sides);
	}
	return results;
}

function rollSingleDice(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function toggleVisibility(className) {
	elements = document.getElementsByClassName(className);
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.display = elements[i].style.display == "none" ? "table-cell" : "none";
	}
}

function switchTab(tabID) {
	tabs = document.getElementsByClassName("tab-body");
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i].id == (tabID + "-body")) {
			tabs[i].style.display = "block";
		} else {
			tabs[i].style.display = "none";
		}
	}
	document.getElementById(tabID + "-body").display = "block";
}

//Function to save a file on the user's local file system
function download() {
	var content = JSON.stringify($("form[id='character-sheet']").serializeArray());
	var fileName = "json.txt";
	var contentType = "text/plain";
	
	//DEBUG alert(content);
	downloadFile(content, fileName, contentType);
}

function downloadFile(data, fileName, type="text/plain") {
	// Create an invisible A element
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);

	// Set the HREF to a Blob representation of the data to be downloaded
	a.href = window.URL.createObjectURL(
	new Blob([data], { type })
	);

	// Use download attribute to set set desired file name
	a.setAttribute("download", fileName);

	// Trigger the download by simulating click
	a.click();

	// Cleanup
	window.URL.revokeObjectURL(a.href);
	document.body.removeChild(a);
}

//Function to load a previously saved file
function upload() {
	var file = document.getElementById("save-file").files[0];


	if (!file) {
		alert("Please choose a file.");
		return;
	}

	var reader = new FileReader();
	reader.onload = function(e) {
		var saveData = JSON.parse(e.target.result);
		
		//Loop through all defined character fields and fill in character sheet
		var n = saveData.length;
		for (var i = 0; i < n; i++) {
			console.log(saveData[i].name + " = " + saveData[i].value);
			document.getElementById(saveData[i].name).value = saveData[i].value
		}
		document.getElementById("upload-form").reset();
		updateLevel();
		alert("Load complete!");
	};

	reader.readAsText(file);
}
