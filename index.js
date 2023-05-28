if (window.location.href.indexOf("file")===-1) {
  webserver = "https://vhusband.areso.pro:8001";
} else {
  //config.isOnline = false;
  webserver = "http://localhost:8000";
  dev_flag  = true;
}
var getLeaderboardTimer         = null;
var getCountOfLiveHusbandsTimer = null;
var getLiveprobeTimer           = null;
var session                     = null;
function setUpBackendTimers(){
  getLeaderboardTimer         = setInterval(getLeaderboard, 30000);
  getCountOfLiveHusbandsTimer = setInterval(getCountOfLiveHusbands, 30000);
  getLiveprobeTimer           = setInterval(getLiveprobe, 30000);
}
setUpBackendTimers()

function getLeaderboard() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    let status = "";
    if (this.readyState === 4 && this.status === 200) {
      messages = JSON.parse(this.responseText);
      let recordsTable = document.getElementById("recordsTable");
      recordsTable.innerHTML="";
      let row   = recordsTable.insertRow(0);
      let cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);
      cell0.innerHTML = "Владелица";
      cell1.innerHTML = "Муж";
      cell2.innerHTML = "дней";
      cell3.innerHTML = "статус";
      cell4.innerHTML = "причина";
      for (var i = 1; i < messages.length; i++) {
        let row   = recordsTable.insertRow(i);
        let cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        cell0.innerHTML = messages[i][0];
        cell1.innerHTML = messages[i][1];
        cell2.innerHTML = messages[i][2];
        cell3.innerHTML = messages[i][3];
        cell4.innerHTML = messages[i][4];
      }
    }
  }
  endpoint  = webserver + "/get_leaderboard";
  xhttp.open("GET", endpoint, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}
getLeaderboard();

function getCountOfLiveHusbands() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      messages = JSON.parse(this.responseText);
      document.getElementById("countLiveHusbands").innerText=messages;
    }
  }
  endpoint  = webserver + "/get_count_of_livehusbands";
  xhttp.open("GET", endpoint, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}
getCountOfLiveHusbands();

function getLiveprobe() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      messages = JSON.parse(this.responseText);
      if (messages===1){
        document.getElementById("serverStatus").innerText="Online";
      }
    } else {
      document.getElementById("serverStatus").innerText="Offline";
    }
  }
  endpoint  = webserver + "/get_liveprobe";
  xhttp.open("GET", endpoint, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}
getLiveprobe();

function newgameAnonym(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      resp_data = JSON.parse(this.responseText);
      session   = resp_data["hid"];
    }
  };
  husband_name = document.getElementById("queryHusbandName").value;
  const regexEn = new RegExp('[^-a-zA-Z0-9_]');
  const regexRu = new RegExp('[^-а-яА-Я0-9_]');
  resultEn = !regexEn.test(husband_name); //should be true
  console.log("En ",resultEn)
  resultRu = !regexRu.test(husband_name); //should be true
  console.log("Ru ",resultRu)
  if (resultEn || resultRu === true) {
    console.log("allowed further");
    payload      = JSON.stringify({"name": husband_name})
    endpoint     = webserver + "/newgame_anonym";
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(payload);
  } else {
    console.log("full stop");
    $("#nameError").modal();
  }
}