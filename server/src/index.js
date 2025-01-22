const getenv = require("getenv");
const fs = require("fs");
const path = require("path");
const util = require("util");
const uap = require("ua-parser-js");

const readFilePromise = util.promisify(fs.readFile);
let imageUrl = false;
const IMAGE_DIR = 'img';

let config = {};
try {
  config = require("./keys/test.js");
} catch (ex) {
  config = {
    GITHUB_ACCESS_TOKEN: getenv.string("GITHUB_ACCESS_TOKEN"),
    GITHUB_REPOSITORY: getenv.string("GITHUB_REPOSITORY"),
  };
}

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: config.GITHUB_ACCESS_TOKEN,
});

const [owner, repo] = config.GITHUB_REPOSITORY.split("/");

let uploadImage = async (b64_image, name) => {
  return await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    message: "Adding an image to the repository",
    path: name,
    content: b64_image,
  });
};

const getSystemInfo = (clientInfo) => {

  return clientInfo? `\n\n**User System Information -**\
      \nBrowser Name: **${clientInfo.browser.name}**\
      \nBrowser Version: **${clientInfo.browser.version}** \
      ${(clientInfo.device && clientInfo.device.type)? "\nDevice Type: **"+clientInfo.device.type+"**": ""}\
      ${(clientInfo.device && clientInfo.device.model)? "\nDevice Model: **"+clientInfo.device.model+"**": ""}\
      \nOS Name: **${clientInfo.os.name}**\
      \nOS Version: **${clientInfo.os.version}**`
  : '';
}

exports.handler = async (event) => {
  let title = event.title;
  let context = JSON.parse(event.context_info);

  if (context.developer_institute === 'DEI' || context.developer_institute === 'dei') {
    context.developer_institute = 'DLBG';
  }
  event.context_info = JSON.stringify(context);

  let label = context.developer_institute;
  let issues = event.issues;
  let email = event.email;
  let experiment_link = event.experiment_link;
  let issuesString = "";
  issues.forEach((issue) => {
    issuesString += "* " + issue + "\n";
  });
  let result = "";
  const timestamp = Date.now();
  const currentDatetime = new Date(timestamp);
  const yearMonth = `${currentDatetime.getFullYear()}${currentDatetime.getMonth()+1}`;
  const imagePath = `${IMAGE_DIR}/${yearMonth}/`;

  event.datetime = currentDatetime.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long"
  });

  if (event.img) {
    let imageName = imagePath + context.developer_institute + timestamp.toString() + ".png";
    result = await uploadImage(event.img, imageName);
    imageUrl =
      "https://raw.githubusercontent.com/virtual-labs/bugs-virtual-labs/main/" +
      imageName;
  }

  const userAgentInfo = event.userAgent || 
  (event.description.includes("UserAgent:") && event.description.split("UserAgent: ").pop());
  const userAgentInfoValid = userAgentInfo && userAgentInfo.trim().length > 0;
  const clientInfo = uap(userAgentInfo);

  let body =
    `### **Bug Reported on ${event.datetime} in**\nLab - **${context.labname}**\nExperiment - **${context.expname}**`;

  if (issues) body += "\n\n**Type(s) of Issue -**\n" + issuesString;
  if (event.description) body += "\n**Additional info-** " + event.description;
  if (userAgentInfoValid) body += getSystemInfo(clientInfo);
  if (experiment_link) body += "\n\nExperiment Link - " + experiment_link;
  if (email) body += "\nUser Email - " + email;
  if (imageUrl)
    body +=
      '\n\n**Screenshot of Issue**-<br> <img height="300" src="' +
      imageUrl +
      '" alt="Issue image">';

  const eventCopy = {...event, img: imageUrl? imageUrl: "", clientInfo, timestamp};
  // Adding a JSON representation of all information for easy machine processing
  body += `\n\n---------\n
      Following information is strictly meant for machine use. Please do not edit:
      \n\nVlabsBugInfo_JSONString<<${JSON.stringify(eventCopy)}>>`;

  const response = await octokit.issues.create({
    owner,
    repo,
    body,
    title,
    result,
    labels: [email==='test@vlabs.ac.in'? 'test': "UNPROCESSED", label],
  });
  let res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      "X-Requested-With": "*",
    },
    response: response,
  };
  return res;
};

// const b64_address = "b64 here";
// uploadImage(b64_address, "testss.png");
