// This mod requires Cookie Clicker Script Extender to work.

if(AutoClick === undefined) var AutoClick = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

AutoClick.name = "Auto Click";
AutoClick.version = "1.0";
AutoClick.gameVersion = "2.048";

AutoClick.launch = function() {
	AutoClick.init = function() {
		AutoClick.isLoaded = 1;
		AutoClick.backup = {};
		AutoClick.config = {};

		AutoClick.config = AutoClick.defaultConfig();
		if (CCSE.config.OtherMods.AutoClick && !Game.modSaveData[AutoClick.name]) {
			Game.modSaveData[AutoClick.name] = JSON.stringify(CCSE.config.OtherMods.AutoClick);
		}
		else if (!Game.modSaveData[AutoClick.name]) {
			Game.modSaveData[AutoClick.name] = JSON.stringify(AutoClick.config);
		}
		else {
			AutoClick.config = JSON.parse(Game.modSaveData[AutoClick.name]);
		}
		
		Game.customOptionsMenu.push(function(){
			CCSE.AppendCollapsibleOptionsMenu(AutoClick.name, AutoClick.getOptionsString());
		});

		Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(AutoClick.name, AutoClick.version);
		});

		if(AutoClick.postloadHooks) {
			for(var i = 0; i < AutoClick.postloadHooks.length; ++i) {
				(AutoClick.postloadHooks[i])();
			}
		}
		
		if (Game.prefs.popups) Game.Popup('Auto Click loaded!');
		else Game.Notify('Auto Click loaded!', '', '', 1, 1);
	}

	AutoClick.save = function(){
		return JSON.stringify(AutoClick.config);
	}
	
	AutoClick.load = function(str){
		var config = JSON.parse(str);
		for(var pref in config){
			AutoClick.config[pref] = config[pref];
		}
	}
	
	AutoClick.defaultConfig = function () {
		return {
			autoClickToggle: false,
			autoClickSpeed: 100
		}
	}
	
	AutoClick.updatePref = function(prefName, value){
		AutoClick.config[prefName] = value;
		Game.modSaveData[AutoClick.name] = AutoClick;
		AutoClick.updateAutoClick();
	}

	AutoClick.getOptionsString = function() {	
		const m = CCSE.MenuHelper;
		const title = "Auto Click";
	
		let str = "<div class='listing'>" +
			m.ToggleButton(AutoClick.config, "autoClickToggle", "autoClickToggleButton", "Auto Click ON", "Auto Click OFF", "AutoClick.Toggle") +
			"</div><br/>";
		str += "<div class='listing'>" +
			m.Slider("autoClickSlider", "Auto Click Speed", "[$] Clicks/Second",  function(){return AutoClick.config.autoClickSpeed;},
				"AutoClick.updatePref('autoClickSpeed', Math.round(l('autoClickSlider').value));" +
				"l('autoClickSliderRightText').innerHTML = AutoClick.config.autoClickSpeed;",
				0, 100, 1) +
			"</div>";
		
		return str;
	}
	
	AutoClick.Toggle = function (prefName, button, on, off, invert) {
		if(AutoClick.config[prefName]){
			l(button).innerHTML = off;
			updatePref(prefName, 0); //AutoClick.config[prefName] = 0;
		}
		else{
			l(button).innerHTML = on;
			updatePref(prefName, 1); //AutoClick.config[prefName] = 1;
		}
		l(button).className = 'smallFancyButton prefButton option' + ((AutoClick.config[prefName] ^ invert) ? '' : ' off');
		/*if(prefName == "autoClickToggle") {
			AutoClick.updateAutoClick();
		}*/
	}


	//********************************
	//	Automatic Clicking
	//********************************

	AutoClick.autoClicker;
	
	AutoClick.updateAutoClick = function() {
		clearInterval(AutoClick.autoClicker);
		if (AutoClick.config.autoClickToggle) {
			AutoClick.autoClicker = setInterval(function(){
				try {
				  Game.lastClick -= 1000;
				  document.getElementById('bigCookie').click();
				} catch (err) {
				  console.error('Stopping auto clicker');
				  clearInterval(AutoClick.autoClicker);
				}
			  }, 1000 / AutoClick.config.autoClickSpeed);
		}
		else if (!AutoClick.config.autoClickToggle) {
			// Leaving this here, just in case.
		}
	}

	if(CCSE.ConfirmGameVersion(AutoClick.name, AutoClick.version, AutoClick.gameVersion)) {
		Game.registerMod(AutoClick.name, AutoClick);
	}
}

if(!AutoClick.isLoaded){
	if(CCSE && CCSE.isLoaded){
		MyMod.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(AutoClick.launch);
	}
}
