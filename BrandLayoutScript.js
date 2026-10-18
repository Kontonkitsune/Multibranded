
var BrandLayout = {
    "Combat": ["Base", "L1","M1","R1","LL2","L2","R2","RR2","L3","M3","R3","Ultimate"],
    "Utility": ["L1","M1","R1","LL2","L2","R2","RR2","LL3","L3","M3","R3","RR3"]
}

var editmode = true
var currentBrand = null
var currentBrandName = "data"
var brandIndex = []
var definitionsIndex = []
var globalDefinitions = []

class EasyToolTip extends HTMLElement {
  connectedCallback() {
    // This lifecycle method fires when the element gets added to the DOM
    if (!this.getAttribute('value')) {this.value = this.innerHTML} else {this.value = this.getAttribute('value')}
    var flag = true
    for (const definition of currentBrand.Definitions) {
        if (this.value == definition.Name || (Array.isArray(definition.Aliases) && definition.Aliases.includes(this.value))) {
            var genhtml = ""
            genhtml += `${definition.Name}\n`
            genhtml += `AKA: ${definition.Aliases}\n`
            genhtml += `${currentBrand.BrandName} Specialty\n\n`
            for (const textline of definition.Text) {
                genhtml += `* ${textline}\n`
            }
            this.title = genhtml
            flag = false
        }
    }
    if (flag) for (const definition of globalDefinitions) {
        if (this.value == definition.Name || (Array.isArray(definition.Aliases) && definition.Aliases.includes(this.value))) {
            var genhtml = ""
            genhtml += `${definition.Name}\n`
            genhtml += `AKA: ${definition.Aliases}\n`
            genhtml += `Source: ${definition.Module}\n\n`
            for (const textline of definition.Text) {
                genhtml += `* ${textline}\n`
            }
            this.title = genhtml
            flag = false
        }
    }
    //this.title = `Bananacentral ${this.innerHTML}`;
  }
}

// Register the custom element with a hyphenated tag name
customElements.define('definition-tooltip', EasyToolTip);

function MultiBrandEdit(brandFields) {
    var genhtml = ""
    var currenttext = ""
    var lstext = `[`
    var tempstr = ""
    var flag = false 
    genhtml += `<dialog open>`
    for (const brandField of brandFields) {
        if (flag) lstext += ","
        flag = true
        lstext += `'${brandField}'`
        currenttext = currentBrand[brandField]
        if (Array.isArray(currenttext)) {
            tempstr = ""
            flag = false
            for (textline of currenttext) {
                if (flag) tempstr += "\n"
                tempstr += textline
                flag = true
            }
            currenttext = tempstr
        }
        genhtml += `<h1>${brandField}</h1>`
        genhtml += `<textarea style="width: 400px; height: 100px;" id="DialogTextArea${brandField}">${currenttext}</textarea>`
        genhtml += `<br>`
    }
    lstext += "]"
    genhtml += `<input type="button" value="Save" onClick="MultiBrandSave(${lstext})">`
    genhtml += `</dialog>`
    document.getElementById("Dialog").innerHTML = genhtml
}
function MultiBrandSave(brandFields) {
    for (const brandField of brandFields) {
        if (Array.isArray(currentBrand[brandField])) {
            currentBrand[brandField] = document.getElementById(`DialogTextArea${brandField}`).value.split("\n")
        } else {
            currentBrand[brandField] = document.getElementById(`DialogTextArea${brandField}`).value
        }
    }
    DisplayJSON(currentBrand)
    document.getElementById("Dialog").innerHTML = ""
}
function DigitToLocation(TalentNumber,BrandType) {
    if (BrandType == "Combat") {
        if (TalentNumber == 0) return "Base"
        if (TalentNumber == 1) return "L1"
        if (TalentNumber == 2) return "M1"
        if (TalentNumber == 3) return "R1"
        if (TalentNumber == 4) return "LL2"
        if (TalentNumber == 5) return "L2"
        if (TalentNumber == 6) return "R2"
        if (TalentNumber == 7) return "RR2"
        if (TalentNumber == 8) return "L3"
        if (TalentNumber == 9) return "M3"
        if (TalentNumber == 10) return "R3"
        if (TalentNumber == 11) return "Ultimate"
    }
}
function TalentEdit(TalentNumber) {
    var genhtml = ""
    var tempstr = ""
    var flag = false
    var currentTalent = currentBrand.Talents[TalentNumber]
    genhtml += `<dialog open>`
    genhtml += `<h1>${DigitToLocation(TalentNumber,currentBrand.BrandType)} Talent</h1>`
    genhtml += `Name: <input id="DialogTalentName" value="${currentTalent.Name}"></input><br>`
    genhtml += `Keywords: <input id="DialogTalentKeywords" value="${currentTalent.Keywords}"></input><br>`
    genhtml += `Cost: <input id="DialogTalentCost" value="${currentTalent.Cost}"></input><br>`
    genhtml += `Simple Description:<br><textarea id="DialogTalentDescription" style="width: 400px; height: 60px;">${currentTalent.SimplifiedDescription}</textarea><br>`
    tempstr = ""
    flag = false
    for (textline of currentTalent.Text) {
        if (flag) tempstr += "\n"
        tempstr += textline
        flag = true
    }
    genhtml += `Text:<br><textarea style="width: 400px; height: 250px;" id="DialogTextArea" >${tempstr}</textarea><br>`
    tempstr = ""
    flag = false
    for (textline of currentTalent.Lore) {
        if (flag) tempstr += "\n"
        tempstr += textline
        flag = true
    }
    genhtml += `Lore:<br><textarea style="width: 400px; height: 250px;" id="DialogLoreArea" >${tempstr}</textarea><br>`
    genhtml += `<input type="button" value="Save" onClick="TalentSave('${TalentNumber}')">`
    genhtml += `</dialog>`
    document.getElementById("Dialog").innerHTML = genhtml
}
function TalentSave(TalentNumber) {

    currentBrand.Talents[TalentNumber].Name = document.getElementById("DialogTalentName").value
    currentBrand.Talents[TalentNumber].Keywords = document.getElementById("DialogTalentKeywords").value.split(",") 
    currentBrand.Talents[TalentNumber].Cost = document.getElementById("DialogTalentCost").value
    currentBrand.Talents[TalentNumber].SimplifiedDescription = document.getElementById("DialogTalentDescription").value

    
    currentBrand.Talents[TalentNumber].Text = document.getElementById("DialogTextArea").value.split("\n") 
    currentBrand.Talents[TalentNumber].Lore = document.getElementById("DialogLoreArea").value.split("\n")

    DisplayJSON(currentBrand)
    document.getElementById("Dialog").innerHTML = ""
}
function TalentImport() {
    var genhtml = ""
    genhtml += `<dialog open>`
    genhtml += `Import:<br><textarea style="width: 500px; height: 500px;" id="DialogTextArea" ></textarea><br>`
    genhtml += `<input type="button" value="Cancel" onClick="document.getElementById('Dialog').innerHTML = '' ">`
    genhtml += `<input type="button" value="Save" onClick="TalentImportSave()">`
    genhtml += `</dialog>`
    document.getElementById("Dialog").innerHTML = genhtml
}
function TalentImportSave() {
    var importstuff = document.getElementById("DialogTextArea").value
    ///Base:|L1:|M1:|R1:|LL2:|L2:|R2:|RR2:|L3:|M3:|R3:|Ult:|Ultimate:|RR3:|LL3/g
    var talents = importstuff.split(/Base:\s|L1:\s|M1:\s|R1:\s|LL2:\s|L2:\s|R2:\s|RR2:\s|L3:\s|M3:\s|R3:\s|Ult:\s|Ultimate:\s|RR3:\s|LL3:\s/g)
    var TalentNumber = 0
    for (const talent of talents) {
        const talent2 = talent.split("\n")
        currentBrand.Talents[TalentNumber].Name = talent2[0]
        currentBrand.Talents[TalentNumber].Keywords = talent2[1].split(" - ")[0].split(" / ") 
        currentBrand.Talents[TalentNumber].Cost = talent2[1].split(" - ")[1]
        currentBrand.Talents[TalentNumber].SimplifiedDescription = talent2[2]
        currentBrand.Talents[TalentNumber].Text = talent2.slice(3)
        currentBrand.Talents[TalentNumber].Lore = ""
        
        TalentNumber += 1
    }

    DisplayJSON(currentBrand)
    document.getElementById("Dialog").innerHTML = ""
}

function DefinitionEdit(DefinitionNumber) {
    var genhtml = ""
    var tempstr = ""
    var flag = false
    var currentDefinition = currentBrand.Definitions[DefinitionNumber]
    genhtml += `<dialog open>`
    genhtml += `<h1>${currentBrand.BrandName} Definition</h1>`
    genhtml += `Name: <input id="DialogDefinitionName" value="${currentDefinition.Name}"></input><br>`
    genhtml += `Keywords: <input id="DialogAliasesArea" value="${currentDefinition.Aliases}"></input><br>`
    tempstr = ""
    flag = false
    if (Array.isArray(currentDefinition.Text)) for (textline of currentDefinition.Text) {
        if (flag) tempstr += "\n"
        tempstr += textline
        flag = true
    }
    genhtml += `Text:<br><textarea style="width: 400px; height: 250px;" id="DialogTextArea" >${tempstr}</textarea><br>`
    tempstr = ""
    flag = false
    if (Array.isArray(currentDefinition.Lore)) for (textline of currentDefinition.Lore) {
        if (flag) tempstr += "\n"
        tempstr += textline
        flag = true
    }
    genhtml += `Lore:<br><textarea style="width: 400px; height: 250px;" id="DialogLoreArea" >${tempstr}</textarea><br>`
    genhtml += `<input type="button" value="Save" onClick="DefinitionSave('${DefinitionNumber}')"><br>`
    genhtml += `<input type="button" value="Delete Definition!" fill="#ff7f7f" onClick="DefinitionDelete('${DefinitionNumber}')">`
    genhtml += `</dialog>`
    document.getElementById("Dialog").innerHTML = genhtml
}
function DefinitionSave(defNumber) {

    currentBrand.Definitions[defNumber].Name = document.getElementById("DialogDefinitionName").value
    currentBrand.Definitions[defNumber].Aliases = document.getElementById("DialogAliasesArea").value.split("\n") 

    
    currentBrand.Definitions[defNumber].Text = document.getElementById("DialogTextArea").value.split("\n") 
    currentBrand.Definitions[defNumber].Lore = document.getElementById("DialogLoreArea").value.split("\n")

    DisplayJSON(currentBrand)
    document.getElementById("Dialog").innerHTML = ""
}
function DefinitionDelete(defNumber) {
    currentBrand.Definitions.splice(defNumber, 1);
    DisplayJSON(currentBrand)
    document.getElementById("Dialog").innerHTML = ""
}
function NewDefinition() {
    currentBrand.Definitions.push({
        "Name":"NewDefinition",
        "Aliases":[],
        "Text":[],
        "Lore":[]
    })
    DisplayJSON(currentBrand)
}

function convertMarkdown(originalText) {
    return originalText.replace(/(?:\|\|)(.*?)(\&\&(.*?))?(?:\|\|)/g, `<definition-tooltip value="$3">$1</definition-tooltip>` )
    
}

function loadBrand() {
    loadJSON(`Brands/${document.getElementById("BrandSelector").value}`)
}

function NewDevTalent() {
    currentBrand.Talents.push({
            "Name": "WIP",
            "Keywords": ["WIP"],
            "Cost": "WIP",
            "SimplifiedDescription": "WIP",
            "Text": ["WIP"],
            "Lore": []
    })
    DisplayJSON(currentBrand)
}
function DeleteTalent(talentNumber) {
    if (talentNumber < 12) {
        currentBrand.Talents[talentNumber].Name = "WIP"
        currentBrand.Talents[talentNumber].Keywords = ["WIP"]
        currentBrand.Talents[talentNumber].Cost = "WIP"
        currentBrand.Talents[talentNumber].SimplifiedDescription = "WIP"
        currentBrand.Talents[talentNumber].Text = ["WIP"]
        currentBrand.Talents[talentNumber].Lore = ["WIP"]
    }
    else {
        currentBrand.Talents.splice(talentNumber,1)
    }
    DisplayJSON(currentBrand)
}
function SwapTalentUp(talentNumber) {
    var temp = currentBrand.Talents[talentNumber]
    currentBrand.Talents[talentNumber] = currentBrand.Talents[talentNumber-1]
    currentBrand.Talents[talentNumber-1] = temp
    DisplayJSON(currentBrand)
}

function DisplayJSON(brand) {
    var genhtml = ""
    currentBrand = brand
    if (!currentBrand.DevNotes) currentBrand.DevNotes = []
    if (!currentBrand.Version) currentBrand.Version = "?"

    genhtml = `<select id="BrandSelector">`
    for (const txt of brandIndex) {
        genhtml += `<option>${txt.trim()}</option>`
    }
    genhtml += "</select>"
    genhtml += `<input type="button" value="Load Brand" onClick="loadBrand()">`
    document.getElementById("SelectBrand").innerHTML = genhtml

    const multieditablearea = ((documentDiv,areaText,brandFields) => {
        var genhtml = ""
        genhtml += `${areaText}`
        if (editmode) {
            var lstext = `[`
            var flag = false 
            for (const brandField of brandFields) {
                if (flag) lstext += ","
                flag = true
                lstext += `'${brandField}'`
            }
            lstext += "]"
            genhtml += ` <input type="button" value="Edit Section" onClick="MultiBrandEdit(${lstext})">`
        }
        document.getElementById(documentDiv).innerHTML = convertMarkdown(genhtml)
    })
    const noneditablearea = ((documentDiv,areaText) => {
        var genhtml = ""
        genhtml += `${areaText}`
        document.getElementById(documentDiv).innerHTML = convertMarkdown(genhtml)
    })

    
    multieditablearea("BrandinCharacterTitle",`${brand.BrandName} in Character`,[`CharacterDescription`,`CharacterTraits`])
    multieditablearea("BrandSpecialSkillsTitle",`${brand.BrandName} Special Skills`,[`SpecialSkill`,`SpecialSkillText`,`InnateSkills`])
    multieditablearea("BrandinLoreTitle",`${brand.BrandName} in Lore`,[`ProgenitorName`,`ProgenitorLore`])
    multieditablearea("BrandName",`${brand.BrandName}`,[`BrandName`,`Version`,`BrandType`,`Description`,`Complexity`,`ComplexityText`])
    multieditablearea("BrandBranchesTitle",`Branches`,[`MainStat`,`Substat1`,`Substat2`,`LeftBranch`,`MiddleBranch`,`RightBranch`])
    multieditablearea("BrandDevNotesTitle",`${brand.BrandName} dev Notes`,[`DevNotes`])

    noneditablearea("BrandSubtitle",`${brand.BrandType} Brand (Version ${brand.Version})`)
    noneditablearea("BrandTreeTitle",`${brand.BrandName} Talent Tree`)
    noneditablearea("AbilitySummaryTitle",`${brand.BrandName} Talents <input type="button" value="Import Talent List" onClick="TalentImport()">`)
    noneditablearea("DevAbilitySummaryTitle",`${brand.BrandName} Dev Talents`)
    noneditablearea("Description",`${brand.Description}`)
    noneditablearea("BrandinCharacter",`${brand.CharacterDescription}`)
    noneditablearea("ComplexityText",`${brand.ComplexityText}`)
    noneditablearea("BrandProgenitorName",`Progenitor: ${brand.ProgenitorName}`)
    noneditablearea("BrandinLore",`<em>${brand.ProgenitorLore}</em>`)
    noneditablearea("BrandSpecialSkill",`${brand.SpecialSkill}`)
    noneditablearea("BrandSpecialSkillText",`${brand.SpecialSkillText}`)
    noneditablearea("BrandBranches",`<table style="width:400px">
        <tr><th style="text-align:center">Left</th><th style="text-align:center">Right</th><th style="text-align:center">Middle</th></tr>
        <tr><td style="text-align:center">||${brand.Substat1}||</td><td style="text-align:center">||${brand.MainStat}||</td><td style="text-align:center">||${brand.Substat2}||</td></tr>
        <tr><td style="text-align:center">${brand.LeftBranch}</td><td style="text-align:center">${brand.MiddleBranch}</td><td style="text-align:center">${brand.RightBranch}</td></tr>
        </table>`)

    var complextext = "Complexity: "
    for (var itervar = 0; itervar < (brand.Complexity > 5 ? brand.Complexity : 5); itervar++) complextext += (itervar < brand.Complexity ? "★" : "☆")
    noneditablearea("Complexity",`${complextext}`)

    var traithtml = `<ul>`
    for (const innateskill of brand.CharacterTraits) traithtml += `<li>"${innateskill}"</li>`
    traithtml += `</ul>`
    noneditablearea("BrandCharacterTraits",`${traithtml}`)

    var devhtml = ""
    for (const devnote of brand.DevNotes) devhtml += `${devnote}<br>`
    noneditablearea("BrandDevNotes",`${devhtml}`)

    var innatehtml = `<ul>`
    for (const innateskill of brand.InnateSkills) innatehtml += `<li>* ${innateskill}</li>`
    innatehtml += `</ul>`
    noneditablearea("BrandInnateSkills",`${innatehtml}`)

    var definitionhtml = `<table>`
    var itervar = 0
    for (const definition of brand.Definitions) {
        definitionhtml += `<tr><td>`
        definitionhtml += `<details>`
        definitionhtml += `<summary><h3 class="talent">${definition.Name}</h3>`
        if (editmode) definitionhtml += ` <input type="button" value="Edit Definition" onClick="DefinitionEdit(${itervar})">`
        definitionhtml += `<br>`
        var flag = false
        if (Array.isArray(definition.Aliases) && !definition.Aliases.length === 0) {
            definitionhtml += `AKA: `
            for (const alias of definition.Aliases) {
                if (flag) definitionhtml += `, ` 
                else flag = true
                definitionhtml += `${alias}`
            }
            definitionhtml += `<br>`
        }
        itervar += 1
        definitionhtml += `${currentBrand.BrandName} Specialty<br>`
        definitionhtml += `</summary>`
        
        definitionhtml += `<ul>`
        if (Array.isArray(definition.Text)) for (const text of definition.Text) {
            definitionhtml += `<li>* ${text}</li>`
        }
        definitionhtml += `</ul>`
        if (Array.isArray(definition.Lore)) for (const loretext of definition.Lore) {
            definitionhtml += `<p class="indented"><em>${loretext}</em></p>`
        }
        definitionhtml += `</details></tr></td>`
    }
    definitionhtml += `</table>`
    definitionhtml += `<input type="button" value="New Definition" onClick="{NewDefinition()}">`
    noneditablearea("BrandDefinitions",`${definitionhtml}`)

    var brandtreehtml = ``
    brandtreehtml += `<svg width="400" height="700">`
    const drawtalentnode = ((x,y,text) => {
        //brandtreehtml += `<svg x="${x}" y="${y}" width="100%" height="100%" viewBox="0 0 100 100">`
        brandtreehtml += `<circle cx="${x}" cy="${y}" r="40" fill="#ffffff" stroke="#000000" stroke-width="4" />`
        brandtreehtml += `<text x="${x}" y="${y}" textLength="70" lengthAdjust="spacingAndGlyphs" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="blue">${text}</text>`
        //brandtreehtml += `</svg>`
    })
    const drawstatnode = ((x,y,text) => {
        //brandtreehtml += `<svg x="${x}" y="${y}" width="100%" height="100%" viewBox="0 0 100 100">`
        var temptext = ""
        var tempcolor = "#ffffff"
        if (text == "Strength")     {temptext = "Str" ; tempcolor = "#edc9c9"}
        if (text == "Fortitude")    {temptext = "Fort"; tempcolor = "#eadabf"}
        if (text == "Will")         {temptext = "Will"; tempcolor = "#a3ecf9"}
        if (text == "Intuition")    {temptext = "Int" ; tempcolor = "#9292f5"}
        if (text == "Ego")          {temptext = "Ego" ; tempcolor = "#f2adf6"}
        if (text == "Mystique")     {temptext = "Myst"; tempcolor = "#a46eb1"}
        if (text == "Control")      {temptext = "Cont"; tempcolor = "#faf4a8"}
        if (text == "Tempo")        {temptext = "Temp"; tempcolor = "#a9fc9c"}

        brandtreehtml += `<circle cx="${x}" cy="${y}" r="20" fill="${tempcolor}" stroke="#000000" stroke-width="4" />`
        brandtreehtml += `<text x="${x}" y="${y}" textLength="30" lengthAdjust="spacingAndGlyphs" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle" font-size="14" >${temptext}</text>`
        //brandtreehtml += `</svg>`
    })
    const linebetween = ((x1,y1,x2,y2) => {
        brandtreehtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="4" />`

    })
    if (brand.BrandType == "Combat") {
        brandtreehtml += `<ellipse cx="200" cy="350" rx="195" ry="345" fill="#ffffff" stroke="#000000" stroke-width="4" />`
        

        linebetween(200,650,125,575)
        linebetween(200,650,200,575)
        linebetween(200,650,275,575)
        
        linebetween(125, 575, 100, 500)
        linebetween(200, 575, 200, 500)
        linebetween(275, 575, 300, 500)

        linebetween(100, 500, 50,  425)
        linebetween(100, 500, 125, 425)
        linebetween(200, 500, 125, 425)
        linebetween(200, 500, 200, 425)
        linebetween(200, 500, 275, 425)
        linebetween(300, 500, 275, 425)
        linebetween(300, 500, 350, 425)

        linebetween(50,  425,  50, 350)
        linebetween(50,  425, 150, 350)
        linebetween(125, 425,  50, 350)
        linebetween(125, 425, 150, 350)
        linebetween(200, 425, 150, 350)
        linebetween(200, 425, 250, 350)
        linebetween(275, 425, 250, 350)
        linebetween(275, 425, 350, 350)
        linebetween(350, 425, 250, 350)
        linebetween(350, 425, 350, 350)

        linebetween(50,  275,  50, 350)
        linebetween(50,  275, 150, 350)
        linebetween(125, 275,  50, 350)
        linebetween(125, 275, 150, 350)
        linebetween(200, 275, 150, 350)
        linebetween(200, 275, 250, 350)
        linebetween(275, 275, 250, 350)
        linebetween(275, 275, 350, 350)
        linebetween(350, 275, 250, 350)
        linebetween(350, 275, 350, 350)

        linebetween(100, 200, 50,  275)
        linebetween(100, 200, 125, 275)
        linebetween(200, 200, 125, 275)
        linebetween(200, 200, 200, 275)
        linebetween(200, 200, 275, 275)
        linebetween(300, 200, 275, 275)
        linebetween(300, 200, 350, 275)
        
        linebetween(125, 125, 100, 200)
        linebetween(200, 125, 200, 200)
        linebetween(275, 125, 300, 200)

        linebetween(200, 50, 125, 125)
        linebetween(200, 50, 200, 125)
        linebetween(200, 50, 275, 125)

        drawstatnode(125, 575, `${brand.Substat1}`)
        drawstatnode(200, 575, `${brand.MainStat}`)
        drawstatnode(275, 575, `${brand.Substat2}`)

        drawstatnode(50,  425, `${brand.MainStat}`)
        drawstatnode(125, 425, `${brand.Substat1}`)
        drawstatnode(200, 425, `${brand.MainStat}`)
        drawstatnode(275, 425, `${brand.Substat2}`)
        drawstatnode(350, 425, `${brand.MainStat}`)
        
        drawstatnode(50,  275, `${brand.MainStat}`)
        drawstatnode(125, 275, `${brand.Substat1}`)
        drawstatnode(200, 275, `${brand.MainStat}`)
        drawstatnode(275, 275, `${brand.Substat2}`)
        drawstatnode(350, 275, `${brand.MainStat}`)
        
        drawstatnode(125, 125, `${brand.Substat1}`)
        drawstatnode(200, 125, `${brand.MainStat}`)
        drawstatnode(275, 125, `${brand.Substat2}`)

        drawtalentnode(200, 650, `${brand.Talents[0].Name}`)

        drawtalentnode(100, 500, `${brand.Talents[1].Name}`)
        drawtalentnode(200, 500, `${brand.Talents[2].Name}`)
        drawtalentnode(300, 500, `${brand.Talents[3].Name}`)
        
        drawtalentnode( 50, 350, `${brand.Talents[4].Name}`)
        drawtalentnode(150, 350, `${brand.Talents[5].Name}`)
        drawtalentnode(250, 350, `${brand.Talents[6].Name}`)
        drawtalentnode(350, 350, `${brand.Talents[7].Name}`)
        
        drawtalentnode(100, 200, `${brand.Talents[8].Name}`)
        drawtalentnode(200, 200, `${brand.Talents[9].Name}`)
        drawtalentnode(300, 200, `${brand.Talents[10].Name}`)
        
        drawtalentnode(200,  50, `${brand.Talents[11].Name}`)
    }
    brandtreehtml += `</svg>`
    document.getElementById("BrandTree").innerHTML = `${brandtreehtml}`
    
    var talentshtml = `<table>`
    var devtalentshtml = `<table>`
    itervar = 0
    for (const talent of brand.Talents) {
        var curtalenthtml = ``
        curtalenthtml += `<tr><td>`
        curtalenthtml += `<details>`
        curtalenthtml += `<summary><h3 class="talent">${talent.Name}</h3><div> (${BrandLayout[brand.BrandType][itervar]})`
        if (editmode) curtalenthtml += ` <input type="button" value="Edit Talent" onClick="TalentEdit(${itervar})">`
        if (editmode && itervar != 0) curtalenthtml += ` <input type="button" value="Swap Above" onClick="SwapTalentUp(${itervar})">`
        curtalenthtml += `</div><br>`
        itervar += 1
        var flag = false
        for (const keyword of talent.Keywords) {
            if (flag) {curtalenthtml += ` / `}
            else {flag = true}
            curtalenthtml += `\|\|${keyword}\|\|`
        }
        curtalenthtml += ` - ${talent.Cost}<br>`
        curtalenthtml += `<b>${talent.SimplifiedDescription}</b>`
        curtalenthtml += `</summary>`
        
        curtalenthtml += ``

        curtalenthtml += `<ul>`
        for (const text of talent.Text) {
            curtalenthtml += `<li>* ${text}</li>`
        }
        curtalenthtml += `</ul>`

        for (const loretext of talent.Lore) {
            curtalenthtml += `<p class="indented"><em>${loretext}</em></p>`
        }

        if (itervar <= 12) {
            curtalenthtml += `</details></tr></td>`
            talentshtml += curtalenthtml
        } else {
            console.log(itervar, "Succeeded")
            curtalenthtml += `<input type="button" value="Remove Talent" onClick="RemoveTalent(${itervar})">`
            curtalenthtml += `</details></tr></td>`
            devtalentshtml += curtalenthtml
        }
    }
    talentshtml += `</table>`
    devtalentshtml += `</table><br><input type="button" value="new Talent" onClick="NewDevTalent()">`
    noneditablearea("BrandTalents",`${talentshtml}`)
    noneditablearea("BrandDevTalents",`${editmode ? devtalentshtml : ''}`)
}

async function loadJSON(jsonname) {
    console.log(jsonname)
    try {
        const response = await fetch(`./${jsonname}.json`)
        if (!response.ok) {
            throw new Error("HTTP ERROR!")
        }
        const jsondata = await response.json()
        console.log(jsondata)
        DisplayJSON(jsondata)

    } catch (error) {
        console.error("Failed to load JSON data:", error)
    }
    

}

async function loadTxt(document,behavior) {
    try {
        const response = await fetch(`./${document}.txt`)
        if (!response.ok) {
            throw new Error("HTTP ERROR!")
        }
        const text = await response.text()
        if (behavior == "Definitions") definitionsIndex = text.split("\n")
        else if (behavior == "Brands") brandIndex = text.split("\n")

    } catch (error) {
        console.error("Failed to load txt data:", error)
    }
    

}

async function startupFunction() {
    try {const response = await fetch(`./Definitions/index.txt`)
        if (!response.ok) throw new Error("HTTP ERROR!")
        const text = await response.text()
        definitionsIndex = text.split("\n")
    } catch (error) {console.error("Failed to load txt data:", error)}
    
    for (const jsonname of definitionsIndex) {
        try {const response = await fetch(`./Definitions/${jsonname}.json`)
            if (!response.ok) {throw new Error("HTTP ERROR!")}
            const jsondata = await response.json()
            for (const def of jsondata.Definitions) {
                def.Module = jsondata.ModuleName
            }
            globalDefinitions.push(...jsondata.Definitions)

        } catch (error) {console.error("Failed to load JSON data:", error)}
    }   
    

    try {const response = await fetch(`./Brands/index.txt`)
        if (!response.ok) {throw new Error("HTTP ERROR!")}
        const text = await response.text()
        brandIndex = text.split("\n")

    } catch (error) {console.error("Failed to load txt data:", error)}

    loadJSON("ExampleBrand")
}

window.onload = startupFunction

function createIndex(text) {
     
}


function jsonreplacer(key, value) {
    if (value instanceof Set ) return [...value]
    if (value instanceof Map) {
        return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}
function jsonreviver(key, value) {
    if (key === 'tags' && Array.isArray(value)) {
        return new Set(value);
    }
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
        return new Map(value.value);
        }
    }
    return value;
}
document.getElementById('characterFileInput').addEventListener('change', async (event) => {

    const curFile = event.target.files[0]
    if (!curFile) return;
    try {
        const fileContent = await curFile.text()

        currentBrand = JSON.parse(fileContent,jsonreviver)
        DisplayJSON(currentBrand)
        
    } catch (error) {
        console.error("Error reading file:", error)
    }

})
function downloadCharacter() {
    // Create a blob of the data
    var fileToSave = new Blob([JSON.stringify(currentBrand, jsonreplacer, 4)], {
        type: 'application/json'
    });
    const fileURL = URL.createObjectURL(fileToSave)
    const link = document.createElement('a')
    link.href = fileURL
    link.download = `brand_${currentBrand.BrandName}_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(fileURL)
    
}
function HandleSaveFile(brand) {
    var jsonData = JSON.stringify(brand)
    var fs = require('fs');
    fs.writeFile("test.txt", jsonData, function (err) {
        if (err) {
            console.log(err);
        }
    });
}