var input = document.querySelector("#up");
var output = document.getElementById("exif_wrapper");

var filename = undefined;
input.addEventListener("change", load);
var start = document.getElementById("start_btn");
function load() {
  var fr = new FileReader();
  fr.readAsArrayBuffer(this.files[0]);
  filename = this.files[0].name;
  fr.onload = show_exif_data;
}
function show_exif_data() {
  var exif = EXIF.readFromBinaryFile(this.result, function () {});
  var allMetaData = EXIF.getAllTags(this.result);
  console.log(typeof exif);
  var allMetaDataSpan = document.getElementById("metadata-span");
  allMetaDataSpan.innerHTML = JSON.stringify(exif, null, "\n");

  start.addEventListener("click", () => process(this.result));
}
function process(result) {
  var dv = new DataView(result);
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
        pieces[i] = { recess: recess, offset: offset - 2 };
        recess = offset + dv.getUint16(offset);
        i++;
      } else if (app1 == 0xffda) {
        break;
      }
      offset += dv.getUint16(offset);
      var app1 = dv.getUint16(offset);
      offset += 2;
    }
    if (pieces.length > 0) {
      var newPieces = [];
      pieces.forEach(function (v) {
        newPieces.push(result.slice(v.recess, v.offset));
      }, this);
      newPieces.push(result.slice(recess));
      var br = new Blob(newPieces, { type: "image/jpeg" });
      const url = URL.createObjectURL(br);
      const link = document.createElement("a");
      link.href = url;
      link.innerText = "Download";
      link.download = "processed_" + filename;
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
