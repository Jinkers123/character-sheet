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
	
	//Calculate AC proficiency based on Proficiency bonus + level and populate the abilityProf field
	var acProf = parseInt(document.getElementById("ac-prof").value) + parseInt(document.getElementById("character-level").value);
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
	
	//Calculate DC proficiency based on Proficiency bonus + level (or zero if untrained)
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
		var	i;
		
		for (i = 0; i < skills.length; ++i) {
			updateSection(skill);
		}
	} else {
		//Get list of skills and loop through them
		var skills = document.querySelectorAll(".skill");
		var	i;
		
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

function toggleVisibility(className) {
    elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = elements[i].style.display == 'none' ? 'table-cell' : 'none';
    }
}

function download() {
	var content = JSON.stringify($("form").serializeArray());
	var fileName = "json.txt";
	var contentType = "text/plain";
	
	alert(content);
	downloadFile(content, fileNme, contentType);
	
}

function downloadFile(data, filename, type="text/plain") {
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