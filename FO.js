// We will be creating a File System Organizer//
//Features of the Project -
//If you have numerous Files in a folder and they are not Properly arranged
//So you can use this tool to arrange them in specific directory according to their extension
// like text files will go into text File Folder .exe files will go into application folder and so on
// so at the end you will have a arranged set of files in specific folders

const fs = require("fs");
const path = require("path");

let inputArr = process.argv.slice(2); //it will treat command as array  || argv--> argument vector
//[2] as it will treat "node filename ssss" as array elements with index 0 1 2 so no need to tske inputArr from index 1,2

//***** java script mein inputArr array k from mein jata hai i.e. process.argv *****


let types = {
  media: ["mp4", "mkv", "mp3"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
    "tex",
  ],
  app: ["exe", "dmg", "pkg", "deb"],
};



let command = inputArr[0]; // tree, organize,help


switch (command) {
  case "tree":
    console.log("Tree implemented");
    break;
  case "organize":
    console.log("Organize Implemented");
    organizeFun(inputArr[1]);
    break;
  case "help":
    helpful();
    break;

  default:
    console.log("Please enter a valid command");
    break;
}

function helpful() {
  console.log(`
    List of all the commands :- 
      
      1) tree command - node FO.js tree <dirname>
      2) organize command - node FO.js organize <dirname>
      3) help command - node FO.js help
      `);
}


function organizeFun(dirpath) {
  //input of directory path

  let destPath;

  if (dirpath == undefined) {
    console.log("Please enter valid directory path");
    //check whether dirpath is passed or not
    return;
  } else {
    let doesExist = fs.existsSync(dirpath);
    //tells whether dirpath is exists or not

    if (doesExist == true) {
      destPath = path.join(dirpath, "Organized_files");
      //path for the folder

      if (fs.existsSync(destPath) == false) {
        fs.mkdirSync(destPath);
      } else {
        console.log("This folder already exists");
      }
    } else {
      console.log("Please enter valid directory path");
    }
  }
  
  organizeHelper(dirpath, destPath)

}


// we are writing this function to categorize our files
function organizeHelper(src , dest){
  let childNames = fs.readdirSync(src) // get all the files and folders inside your src
  //console.log(childNames) 
  
  for(let i=0 ; i<childNames.length ; i++){
        let childAddress = path.join(src , childNames[i]) // path is identified for the files
        let isFile = fs.lstatSync(childAddress).isFile() // we check here to identify only the files
       // console.log(childAddress + "  " + isFile)


        if(isFile==true){
          let fileCategory = getCategory(childNames[i])
          console.log(childNames[i] + " belongs to "+ fileCategory)

          sendFiles(childAddress, dest, fileCategory)
   }
        
  }
}


function getCategory(name){
  let ext = path.extname(name)
  ext = ext.slice(1)
 // console.log(ext)//output extension of files
  
 for(let type in types){
    let catTypeArr = types[type]
   // console.log(catTypeArr)

    for(let i=0; i<catTypeArr.length; i++){
      if(ext==catTypeArr[i])
        //we matched extensions with the values present in ctpe array
        return type
      
    }
 }

 return "others"

}


function sendFiles(srcFilePath, dest, fileCategory){
    let catPath = path.join(dest, fileCategory)

    if(fs.existsSync(catPath)== false){
      fs.mkdirSync(catPath)
    }

    let fileName = path.basename(srcFilePath)//we took out names  of files
    let destFilePath = path.join(catPath,fileName)//hre created path for files in category folder

    fs.copyFileSync(srcFilePath,destFilePath)//copied files from src to dest
    fs.unlinkSync(srcFilePath)  // deleted the files from src

    console.log(fileName + " is copied to " + fileCategory)

}
