function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let images = [document.getElementById("N1"), document.getElementById("N2"), document.getElementById("N3"), document.getElementById("N4"), document.getElementById("N5"),document.getElementById("N6"),document.getElementById("N7"),document.getElementById("N8"),document.getElementById("N9"),document.getElementById("N10"),document.getElementById("N11"), document.getElementById("N12")];
while (true){
  let i = Math.floor(Math.random*12);
  images[i].hidden = false;
  await sleep(2);
  images[i].hidden = true;
}