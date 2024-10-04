# SVC Bug Report WebComponent for Virtual Labs
This repo contains the code for bug report web component for virtual labs, which can be used in any HTML webpage.  
The web component takes certain inputs and returns an event on success, which can be handled however the developer would like.  

## Features
The following are features which are easily extendible:
* User can select from a preset options based on page type.
* User can share a screenshot.
* User can write a detailed report.

We mandate at least two of the three to be done, for precision.

## How To Use
1. In the root html file, the js script needs to be imported as a module.
2. Then wherever you want to use the bug report component to be placed, use it like any other html component,```<bug-report></bugreport>```
For example:
```
<html>
<head>
<script type="module" src="client/src/bug-report.js"></script>
</head>
<body>
*
*
*
<bug-report 
    id="bug-report"
    title="Title"
    page-type="<page type, options given in next section>"
    context-info="{{ bugreport_context_info }}"
    checkbox-json="{{ page_plugins.plugin-bug-report.attributes.issues }}"
    style="position: absolute; right: 0; top: 25%"
    button_style="border: none; color: #fff; background-color: #288ec8; text-align: center; font-size: 1.05rem; border-radius: 1em;padding: 0.6em 1.2em;"
    position="override"
    custom_button_class="v-button"
></bug-report>
</body>
</html>
```

## Editable attributes
**1. title**  
This will be the title in the event on submitting the bug report.  
**2. page-type**   
This is a list of hardcoded questions based on the following [types](hhttps://github.com/virtual-labs/svc-bug-report/blob/main/questions.json).  

Depending on the type given, the Multiple Choice options will be rendered.  
**3. context-info**   
This data will be passed as it is, this is left for the developer to deal with. One possible use case would be to pass custom data for google analytics.  
**4. checkbox-json**
This would consist of additional questions which you want to ask. The format for the same is as follows [here](https://github.com/virtual-labs/ph3-lab-mgmt/blob/master/assets_plugins/json/bug-report-questions.js)
**5. button_style**  
This would need styling if you would like to add css to bug report button. 
**6. position**  
This can be either of:  
  * top
  * left
  * bottom
  * right
  * top left
  * bottom right etc
If you want to add your own positioning, set position to ```override``` and add position css to style normally. (This is shown in example above)  

**7. custom_button_class**  
Similar to button_style, but in the case, if you want the button to follow styling from a class, pass the class name here.  

## Events
1. ```bugreport_success``` event is raised on suceessful submission, this can be handled however developer wants.  Currently the success message appear at the center of the page.

## To Move to Production
1. For moving the bug report from testing to deployment, please remove the if condition from the following two files
   1. https://github.com/virtual-labs/ph3-lab-mgmt/blob/master/exp_build/templates/partials/bug-report-mobile.handlebars 
   2. https://github.com/virtual-labs/ph3-lab-mgmt/blob/master/exp_build/templates/partials/header.handlebars#L16
2. This will build bug report in all stages of deployment.

## TODO
Host the wc branch on github pages