/** @param {NS} ns */
export async function main(ns) {

  let ascensionThresh = 1.5;
  let namenum = 0;
  let namelist = ["bob", "bobby", "Walter White", "Gus Fring",
    "bro1", "bro", "bro2", "Nobody", "John Wick", "N00dleMan", "Jack", "Jill"];
  let members = ns.gang.getMemberNames();




  let warfareGroup = [];
  let trainGroup = [];
  let crimeGroup = [];
  let acensionGroup = [];
  let heroGroup = [];
  let terroristGroup = [];

  while (members.length < 12) {
    ns.clearLog();
    ns.disableLog("ALL");
    let members = ns.gang.getMemberNames();
    trainGroup = []
    acensionGroup = [];
    terroristGroup = [];

    for (let member of members) {
      if (ns.gang.getAscensionResult(member) == undefined) {
        ns.print("Unable to Ascend");
      } else if (ns.gang.getAscensionResult(member).def > ascensionThresh || ns.gang.getAscensionResult(member).str > ascensionThresh) {
        acensionGroup.push(member);
      } //else { ns.print("Member cannot Ascend: " + member) }
    }
    for (let ascendee of acensionGroup) {
      ns.gang.ascendMember(ascendee);
    }

    if (namenum >= 12) {
      namenum = 1;
    }
    for (let member of members) {
      if (ns.gang.getMemberInformation(member).def < 250) {
        trainGroup.push(member);
      } else {
        terroristGroup.push(member)
      }
    }
    if (ns.gang.recruitMember(namelist[namenum])) {
      namenum++;
      ns.print("Recuited New Member")
    } else {
      namenum++;
    }

    JobAssigner(ns, trainGroup, terroristGroup, crimeGroup, warfareGroup);

    ns.print("The Money Makers: " + crimeGroup);
    ns.print("The Soldiers: " + warfareGroup);
    //ns.print("Those who will rotate: " + crimeRotate);
    ns.print("The Heros: " + heroGroup);
    ns.print("Those who will Ascend:" + acensionGroup);
    ns.print("Training: " + trainGroup);

    await ns.sleep(1000);
  }

  while (members.length == 12) {
    let members = ns.gang.getMemberNames();

    ns.clearLog();
    ns.disableLog("ALL");
    crimeGroup = [members[0], members[1], members[2], members[3], members[4], members[5]];
    warfareGroup = [members[8], members[9], members[6], members[10], members[11], members[7]];
    let crimeRotate = [crimeGroup[1], crimeGroup[0], crimeGroup[2]];


    acensionGroup = [];
    heroGroup = [];
    trainGroup = [];

    for (let member of members) {
      if (ns.gang.getAscensionResult(member) == undefined) {
        ns.print("Unable to Ascend");
      } else if (ns.gang.getAscensionResult(member).def > ascensionThresh || ns.gang.getAscensionResult(member).str > ascensionThresh) {
        acensionGroup.push(member);
      } //else { ns.print("Member cannot Ascend: " + member) }
    }
    for (let ascendee of acensionGroup) {
      ns.gang.ascendMember(ascendee);
    }
    for (let member of members) {
      if (ns.gang.getMemberInformation(member).def < 700) {
        crimeGroup = crimeGroup.filter(num => num !== member);
        warfareGroup = warfareGroup.filter(num => num !== member);
        trainGroup.push(member);
      } //else { ns.print("Don't need Training: " + members) }
      if (ns.gang.getGangInformation().wantedPenalty <= 0.65) {
        for (member of crimeRotate) {
          crimeGroup = crimeGroup.filter(num => num !== member);
          heroGroup.push(member);
        }
      }
    }

    let equipmentNeeded = [];
    let weapons = ns.gang.getEquipmentNames();
    for (let weapon of weapons) {
      if (ns.gang.getEquipmentStats(weapon).def > 1 || ns.gang.getEquipmentStats(weapon).str > 1) {
        equipmentNeeded.push(weapon);
      }
    }
    ns.print("Equipment Required: " + equipmentNeeded);
    for (let equipment of equipmentNeeded) {
      for (let member of members) {
        let costOfEquipment = ns.gang.getEquipmentCost(equipment) * 12;
        if (costOfEquipment < ns.getPlayer().money) {
          ns.gang.purchaseEquipment(member, equipment)
          ns.gang.purchaseEquipment(member, "White Ferrari")

          //ns.print("equipment bought!: " + equipment);
        } else {
          //ns.print("order cancelled");

          break;
        }
      }
    }

    //Rival gangs
    let war = false;
    let gangInfos = ns.gang.getOtherGangInformation();
    let activegangs = [];

    for (let ganginfo in gangInfos) {
      let territory = gangInfos[ganginfo].territory;
      //ns.print(`Territory of ${ganginfo}: ${territory}`);
      if (territory !== 0 && ganginfo !== "Slum Snakes") {
        activegangs.push(ganginfo);
      }
    }
    ns.print('Active gangs: ' + activegangs);

    if (activegangs !== 0) {
      for (let activegang of activegangs) {
        if (ns.gang.getChanceToWinClash(activegang) > 0.55) {
          war = true;
          break;
        } else {
          war = false;
        }
      }
    }
    ns.print("War?: " + war);
    while (war == true) {
      ns.gang.setTerritoryWarfare(war);
      for (let member of members) {
        ns.gang.setMemberTask(member, "Territory Warfare");
      }
      await ns.sleep(20010);
      war = false;
      ns.gang.setTerritoryWarfare(war);
    }
    if (ns.gang.getGangInformation().territory == 1) {
      for (let member of members) {
        ns.gang.setMemberTask(member, "Human Trafficking")
      }
    } else {
      JobAssigner(ns, trainGroup, terroristGroup, crimeGroup, warfareGroup);
    }

    //if()
    ns.print("The Money Makers: " + crimeGroup);
    ns.print("The Soldiers: " + warfareGroup);
    ns.print("Those who will rotate: " + crimeRotate);
    ns.print("The Heros: " + heroGroup);
    ns.print("Those who will Ascend:" + acensionGroup);
    ns.print("Training: " + trainGroup);

    await ns.sleep(40000);
  }

}




/** @param {NS} ns */
function JobAssigner(ns, trainGroup, terroristGroup, crimeGroup, warfareGroup) {

  for (let trainee of trainGroup) {
    ns.gang.setMemberTask(trainee, "Train Combat");
  }
  for (let terrorist of terroristGroup) {
    ns.gang.setMemberTask(terrorist, "Terrorism");

  }
  if (crimeGroup.length > 0) {
    for (let crimer of crimeGroup) {
      ns.gang.setMemberTask(crimer, "Human Trafficking")
    }
  }
  if (warfareGroup.length > 0) {
    for (let soldier of warfareGroup) {
      ns.gang.setMemberTask(soldier, "Territory Warfare");
    }
  }
}
