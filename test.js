function createTable() {
  const obj = {
    name: "xd",
    age: "12",
    em: "Yes of course",
    arr: [1, 2, 3, 5],
  };
  var tab = document.createElement("table");
  var tabBody = document.createElement("tbody");
  for (const [key, prop] of Object.entries(obj)) {
    var row = document.createElement("tr");
    let keyN = document.createElement("td");
    let keyV = document.createTextNode(key);
    keyN.appendChild(keyV);
    row.appendChild(keyN);
    let propN = document.createElement("td");
    let propV = document.createTextNode(prop);
    propN.appendChild(propV);
    row.appendChild(propN);
    tabBody.appendChild(row);
  }
  tab.appendChild(tabBody);
  document.getElementById("test1").appendChild(tab);
}

createTable();
