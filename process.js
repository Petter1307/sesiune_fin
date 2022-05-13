var input = document.querySelector("#up");

input.addEventListener("change", load);
function load() {
  var fr = new FileReader();
  fr.onload = process;
  fr.readAsArrayBuffer(this.files[0]);
  const filename = fr.filename;
  console.log(fr);
}
function process() {
  var dv = new DataView(this.result);
  var offset = 0,
    recess = 0;
  var pieces = [];
  var i = 0;
  if (dv.getUint16(offset) == 0xffd8) {
    offset += 2;
    var app1 = dv.getUint16(offset);
    offset += 2;
    while (offset < dv.byteLength) {
      if (app1 == 0xffe1) {
        console.log(app1);
        pieces[i] = { recess: recess, offset: offset - 2 };
        recess = offset + dv.getUint16(offset);
        i++;
      } else if (app1 == 0xffda) {
        break;
      }
      offset += dv.getUint16(offset);
      console.log(offset);
      var app1 = dv.getUint16(offset);
      offset += 2;
    }
    if (pieces.length > 0) {
      var newPieces = [];
      pieces.forEach(function (v) {
        newPieces.push(this.result.slice(v.recess, v.offset));
      }, this);
      newPieces.push(this.result.slice(recess));
      var br = new Blob(newPieces, { type: "image/jpeg" });
      console.log(br);
      const url = URL.createObjectURL(br);
      const link = document.createElement("a");
      link.href = url;
      link.innerText = "Download xd";
      link.download = "processed_img";
      link.id = "download_a";
      const output_img = document.createElement("img");
      output_img.src = link.href;
      output_img.id = "output_i";
      document.getElementById("img_wrapper").appendChild(output_img);
      document.getElementById("download_wrapper").appendChild(link);
    } else {
      const err = document.createElement("p");
      err.innerText = "piece.length is fucked"; // in case that it failed to process the inforamtion form the file
      document.getElementById("img_wrapper").appendChild(err);
    }
  } else {
    const err = document.createElement("p");
    err.innerText = "dv.getUint16(offset) == 0xffd8 is fucked"; // this error should be in case that the file format is not ok.
    document.getElementById("img_wrapper").appendChild(err);
  }
}
