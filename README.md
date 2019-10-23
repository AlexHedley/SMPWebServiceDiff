# SMP WebService Diff

[![Language: PowerShell](https://img.shields.io/badge/language-powershell-blue.svg)](https://docs.microsoft.com/en-us/powershell/scripting/overview?view=powershell-6)
[![Language: HTML](https://img.shields.io/badge/language-html-purple.svg)](https://www.w3.org/html/)
[![Language: CSS](https://img.shields.io/badge/language-css-purple.svg)](https://www.w3.org/Style/CSS/)
[![Language: JS](https://img.shields.io/badge/language-javascript-purple.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
|
![](https://img.shields.io/badge/tag-smp-yellow.svg)
![](https://img.shields.io/badge/tag-symantec-yellow.svg)
![](https://img.shields.io/badge/tag-webservice-yellow.svg)
|
[![GitHub contributors](https://img.shields.io/github/contributors/Protirus/SMPWebServiceDiff.svg)](https://GitHub.com/Protirus/SMPWebServiceDiff/graphs/contributors/)
|
[![GitHub issues](https://img.shields.io/github/issues/Protirus/SMPWebServiceDiff.svg)](https://GitHub.com/Protirus/SMPWebServiceDiff/issues/)
[![GitHub issues-closed](https://img.shields.io/github/issues-closed/Protirus/SMPWebServiceDiff.svg)](https://GitHub.com/Protirus/SMPWebServiceDiff/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/Protirus/SMPWebServiceDiff.svg)](https://GitHub.com/Protirus/SMPWebServiceDiff/pull/)

![SMP](images/smp.png) SMP WebService Diff Tool has been created to show a quick and easy difference between versions of the SMP. When a new version is released follow the setup and create a new `json` file, add it to the app and now you can see new WS methods.

---

Example Site: [https://protirus.github.io/SMPWebServiceDiff/](https://protirus.github.io/SMPWebServiceDiff/)

---

## Setup

Create a Folder with the version number of the SMP you are retrieving the WSDLs from.

Save the WSDLs as XML.

For example

- `http://localhost/Altiris/ASDK.Task/TaskManagementService.asmx?WSDL`

Currently each version hosted has the following.

- CollectionManagementService.xml
- ItemManagementService.xml
- ItemModel.xml
- PatchWorkflowSvc.xml
- ResourceManagementService.xml
- ResourceModel.xml
- ScopingManagementService.xml
- TaskManagementService.xml
- TaskServerModel.xml

You could add any others you need. 

Example
```
7.1.8280
    CollectionManagementService.xml
    ItemManagementService.xml
ParseSMPWSs.ps1
```

Run the powershell script [ParseSMPWSs.ps1](data\ParseSMPWSs.ps1) and the number of folders you have created will be output.

i.e. if you have a folder called `7.1.8280` there will be a file in the same directory called `7.1.8280.json`.

Example
```
7.1.8280
7.1.8280.json
ParseSMPWSs.ps1
```

The structure of the JSON can be seen with the [example.json](data/example.json) file, or any of the others in the data folder.

These then need adding to the `data` folder of this web app and the [app.js](js\app.js) file needs updateing.

This is because I've built a static site that can be hosted here on [github](https://alexhedley.github.io/SMPWebServiceDiff/)

Add the file name to the array: [app.js](js\app.js#L22)

```js
$scope.files = ['7.1.8280', '8.0.2298', '8.1.5811.0', '8.5.3025.0'];
```

---

### Extras

One option is to check the SMP server for `*.asmx` files.

```powershell
$path = '[Install Drive]:\Program Files\Altiris'

Get-ChildItem -Path $path -Filter *.asmx -Recurse -File -Name| ForEach-Object {
    $_
}
```

But you'd want the script to get this path automatically and not manually change the `$path` depending on which SMP Server you are on.

You could get this using a Reg Key.

Example
```powershell
$key = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion'
(Get-ItemProperty -Path $key -Name ProgramFilesDir).ProgramFilesDir
```

You need to grab:

```
HKEY_LOCAL_MACHINE\SOFTWARE\Altiris\AIM
	ProductVersion	(REG_SZ)
```
