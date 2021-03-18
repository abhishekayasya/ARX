const fs = require("fs");
const path = require("path");

const JSP_HEAD_PATH =
  "../alliancerx-www-template/src/main/resources/jnt_template/html/head.angular.jsp";
const NG_DIST_PATH =
  "../alliancerx-www-components/src/main/resources/javascript/angular/refillHub";
const COMPONENTS_JS_PATH =
  "../alliancerx-www-components/src/main/resources/javascript";
const TEMPLATE_CSS_PATH = "../alliancerx-www-template/src/main/resources/css";

function fromDir(startPath, filter, func) {
  if (!fs.existsSync(startPath)) {
    console.log("Directory Not Found", startPath);
    return;
  }
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter, func); //recurse
    } else if (filename.search(filter) >= 0) {
      if (func) {
        try {
          func(filename);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

try {
  console.info("\nDelete CSS Bundles from ", TEMPLATE_CSS_PATH);
  const removeFile = filename => {
    fs.unlinkSync(filename);
    console.log("* Successfully Deleted", filename);
  };
  fromDir(path.join(__dirname, TEMPLATE_CSS_PATH), ".*.bundle.css$", removeFile);

  console.info("\nMoving CSS Bundles to ", TEMPLATE_CSS_PATH);
  const moveFile = filename => {
    const basename = path.basename(filename);
    fs.renameSync(filename, `${TEMPLATE_CSS_PATH}/${basename}`);
    console.log("* Successfully Moved", filename);
  };
  fromDir(path.join(__dirname, COMPONENTS_JS_PATH), ".*.bundle.css$", moveFile);

  console.info("\nUpdating head.angular.jsp with CSS & JS");
  let fileContent = fs.readFileSync(path.join(__dirname, JSP_HEAD_PATH), "utf8");
  const findAndReplace = sourcePath =>
    fromDir(path.join(__dirname, sourcePath), ".*.bundle.*", filename => {
      const basename = path.basename(filename);
      const fileparts = basename.split(".");

      console.info(basename, fileparts[0], fileparts[fileparts.length - 1]);
      const re = new RegExp(
        `${fileparts[0]}.*.bundle.${fileparts[fileparts.length - 1]}`,
        "g"
      );
      fileContent = fileContent.replace(re, basename);
    });
  for (let p of [NG_DIST_PATH, TEMPLATE_CSS_PATH]) {
    findAndReplace(p);
  }

  console.info("\nUpdating head.angular.jsp");
  fs.writeFileSync(path.join(__dirname, JSP_HEAD_PATH), fileContent, "utf8");
} catch (e) {
  console.error('Encountered an error', e);
}