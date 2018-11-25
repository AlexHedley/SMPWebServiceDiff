<#
.SYNOPSIS
  Parse WSDLs

.DESCRIPTION
  Parse SMP WSDLs to JSON for consumption in a Web App

.PARAMETER <>
    The x of the .

.INPUTS
  <Inputs if any, otherwise state None>

.OUTPUTS
  <Outputs if any, otherwise state None - example: Log file stored in C:\Windows\Temp\<name>.log>

.NOTES
  Version:        1.0
  Author:         Alex Hedley
                  Protirus UK Ltd
  Creation Date:  08/11/2018
  Purpose/Change: Initial script development
  
.EXAMPLE
  Call '' to 
#>

#region Initialisations
#---------------------------------------------------------[Initialisations]--------------------------------------------------------
#endregion Initialisations

#region Declarations
#----------------------------------------------------------[Declarations]----------------------------------------------------------
$LogFilePath = "C:\Temp"
$Logfile = $LogFilePath + "\" + $MyInvocation.MyCommand.Name + "_" + (Get-Date -Format yyyy-MM-dd) + ".log"

#endregion Declarations

#region Modules
#------------------------------------------------------------[Modules]-------------------------------------------------------------

#endregion Modules

#region Functions
#-----------------------------------------------------------[Functions]------------------------------------------------------------
#region Templates

Function Template-Function
{
    <#
    .PARAMETER input1
        The 'input1' to do x.
    
    .EXAMPLE
        Template-Function "Input"
    #>

    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$input1
    )

    Begin
    {
        $sw = [Diagnostics.Stopwatch]::StartNew()

        Write-Debug ("Starting {0} " -f $MyInvocation.MyCommand)

        #Create an hashtable variable 
        [hashtable]$Return = @{} 
        $Return.OutCode = 0
        $Return.OutData = {}
        $Return.OutDataShort = ""
    }

    Process
    {
        try
        {
        }
        catch
        {
            Write-Error $Error.item(0)
            $Return.OutCode = 2
            $Return.OutData = $Error.item(0)
            $Return.OutDataShort = $Error.item(0)
        }
    }

    End
    {
        $sw.Stop()

        Write-Debug ("Ending {0} " -f $MyInvocation.MyCommand)

        $outmsg = "Function: Template-Function took '$($sw.Elapsed.TotalSeconds)s' to execute."
        Write-Host $outmsg

        return $Return
    }
}

#endregion Templates

Function Log-Message
{
    <#
    .PARAMETER message
        The message you wish to add to the Logs.
    
    .EXAMPLE
        Log-Message "Hello"
    #>

    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$message
    )

    Begin
    {
        Write-Debug ("Starting {0} " -f $MyInvocation.MyCommand)
    }

    Process
    {
        try
        {
            #$message = $string.Trim("$Return.OutCode $Return.OutData $Return.OutDataShort")
            $LogFileMessage = (Get-Date -Format o) + " " + $env:UserName + " " + $message
            #Write-Host $LogFileMessage
            Out-File -FilePath $Logfile -Append -Force -InputObject $LogFileMessage
        }
        catch
        {
            Write-Error $Error.item(0)
        }
    }

    End
    {
        Write-Debug ("Ending {0} " -f $MyInvocation.MyCommand)
    }
}
#endregion Functions

#region Helpers
#------------------------------------------------------------[Helpers]-------------------------------------------------------------
#endregion Helpers

#region Execution
#-----------------------------------------------------------[Execution]------------------------------------------------------------

$folders = Get-ChildItem -Path $PSScriptRoot -Directory | Select-Object Name

foreach ($folder in $folders) {
    $folderPath = Join-Path -Path $PSScriptRoot -ChildPath $folder.Name

    $files = Get-ChildItem -Path $folderPath | Select-Object Name

    $data = New-Object -TypeName psobject 
    $data | Add-Member -MemberType NoteProperty -Name version -Value $folder.Name
    $data | Add-Member -MemberType NoteProperty -Name webservices -Value @()

    foreach ($file in $files) {
        $content = Join-Path -Path $folderPath -ChildPath $file.Name

        [xml]$xml = Get-Content $content

        $url = $xml.definitions.service.port[0].address.location

        $webService = New-Object -TypeName psobject
        $webService | Add-Member -MemberType NoteProperty -Name name -Value $file.Name
        $webService | Add-Member -MemberType NoteProperty -Name url -Value $url
        $webService | Add-Member -MemberType NoteProperty -Name methods -Value @()

        $elements = $xml.definitions.types.schema.element

        foreach ($element in $elements) {
            $parameters = $element.complexType.sequence.element
            
            $method = New-Object -TypeName psobject
            $method | Add-Member -MemberType NoteProperty -Name name -Value $element.name

            if ($parameters) {
                $method | Add-Member -MemberType NoteProperty -Name parameters -Value @()
            }
            
            foreach ($parameter in $parameters) {
                $name = $parameter.name
                $type = $parameter.type

                $parameter = New-Object -TypeName psobject
                $parameter | Add-Member -MemberType NoteProperty -Name name $name
                $parameter | Add-Member -MemberType NoteProperty -Name type $type

                $method.Parameters += $parameter
            }

            $webService.Methods += $method
        }

        $data.WebServices += $webService
    }

    $data | ConvertTo-Json -Depth 6 | Out-File "$($PSScriptRoot)\$($folder.Name).json"
}

#endregion Execution