# SVC Bug Report WebComponent for Virtual Labs
This repo contains the code for the bug report web component for virtual labs, which can be used in any HTML webpage.  
The web component takes certain inputs and returns an event on success, which can be handled however the developer would like.  

## Features
The following are features that are easily extendible:
* User can select from preset options based on the page type.
* User can share a screenshot.
* User can write a detailed report.

We mandate at least two of the three to be done for precision.

## How To Use
1. In the root html file, the js script needs to be imported as a module.
2. Then, wherever you want to use the bug report component to be placed, use it like any other html component,```<bug-report></bugreport>```
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
This attribute specifies the title displayed when a bug report is submitted.
**2. page-type**   
This attribute defines a list of predefined question sets based on specific types, as referenced [here](https://github.com/virtual-labs/svc-bug-report/blob/main/questions.json). The selected type determines the Multiple Choice options that will be displayed.  
**3. context-info**   
This attribute allows for the inclusion of additional context-specific data. The data will be passed unchanged, giving developers flexibility in how it's utilized. A common use case is to pass custom data for Google Analytics or other tracking tools.
**4. checkbox-json**
This attribute contains additional questions you wish to ask the user. These questions should follow the format outlined [here](https://github.com/virtual-labs/ph3-lab-mgmt/blob/master/assets_plugins/json/bug-report-questions.js)
**5. button_style**  
This attribute specifies the styling for the bug report button. You can define custom CSS properties here to customize the appearance of the button.
**6. position**  
This attribute defines the position of the bug report button. Available options include 'top,' 'left,' 'bottom,' 'right,' 'top left,' 'bottom right,' and others. To apply custom positioning, set the attribute to 'override' and apply CSS styling directly.
**7. custom_button_class**  
Similar to 'button_style', this attribute allows you to specify a class name for the button. The button will inherit all styles defined in the class.

## Events
1. The ```bugreport_success``` event is triggered upon successful submission of a bug report. Developers can handle this event as needed. By default, a success message will be displayed at the center of the page.
2. The ```bugreport_failure``` event is triggered upon failed submission of a bug report. Developers can try to re-submit. By default, a failure message will be displayed at the center of the page.

## To Move to Production
1. To move the bug report from testing to production, follow these steps:
  1. Remove the if condition from the following files:
   1. [bug-report-mobile.handlebars](https://github.com/virtual-labs/ph3-lab-mgmt/blob/master/exp_build/templates/partials/bug-report-mobile.handlebars)
   2. [header.handlebars](https://github.com/virtual-labs/ph3-lab-mgmt/blob/master/exp_build/templates/partials/header.handlebars#L16)
2. This will ensure the bug report feature is deployed across all stages of the environment.

## TODO
Host the wc branch on github pages