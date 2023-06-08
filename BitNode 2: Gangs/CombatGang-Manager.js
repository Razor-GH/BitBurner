/** @param {NS} ns */
export async function main(ns) {
    ns.clearLog();
    ns.disableLog("ALL");


    let ascensionThresh = 1.25;
    let namenum = 0;
    let namelist = ["bob", "bobby", "Walter White", "Gus Fring",
        "bro1", "bro", "bro2", "doomguy", "John Wick", "John Wicks's Dog", "Jack", "Jill"];
    let members = ns.gang.getMemberNames();
    //let numOfMembers = ns.gang.mem
    let curRespect = ns.gang.getGangInformation().respect;

    let reqxpforCriming = 200;
    let trainGroup = [];
    let terroristGroup = [];
    let crimeGroup = [];
    let acensionGroup = [];
    while (true) {
        let trainGroup = [];
        let terroristGroup = [];
        let crimeGroup = [];
        let acensionGroup = [];
        let warGroup = [];

        if (namenum >= 12) {
            namenum = 0;
        }
        if (members.length < 12)
            if (ns.gang.recruitMember(namelist[namenum])) {
                namenum++;
                ns.tprint("Recuited New Member")
            } else {
                namenum++;
            }

        for (let i = 0; i < members.length; i++) {
            if (ns.gang.getMemberInformation(members[i]).def < 250) {
                trainGroup.push(members[i]);
            }
            if (ns.gang.getMemberInformation(members[i]).def >= 250) {
                terroristGroup.push(members[i]);

            }
            if (ns.gang.getMemberInformation(members[i]).def >= 400) {
                crimeGroup.push(members[i]);
            }
            if (ns.gang.getMemberInformation(members[i]).def >= 1000) {
                warGroup.push(members[i]);
            }
        }
        for (let i = 0; i < members.length; i++) {
            if (ns.gang.getAscensionResult(members[i]) == undefined) {
                ns.print("Unable to Ascend");
            } else if (ns.gang.getAscensionResult(members[i]).def > ascensionThresh) {
                acensionGroup.push(members[i]);
            }
        }

        ns.print("Crime Group: " + crimeGroup);
        ns.print("Terrorist Group: " + terroristGroup);
        ns.print("Training Group: " + trainGroup);
        ns.print("Ascending: " + acensionGroup);

        taskAssigner(ns, acensionGroup, trainGroup, terroristGroup, crimeGroup, warGroup);

        if (members.length >= 12) {
            ns.print("Enough Members!!")
            if (ns.gang.getGangInformation().wantedPenalty < 0.65) {
                for (let i = 0; i < members.length/2; i++) {
                    ns.gang.setMemberTask(members[i], "Vigilante Justice");
                }
            }

        }

        ns.print("Name Increment: " + namenum);
        ns.print("Delaying")
        await ns.sleep(1000);


    }
    /** @param {NS} ns */
    function taskAssigner(ns, acensionGroup, trainGroup, terroristGroup, crimeGroup, warGroup) {
        for (let i = 0; i < acensionGroup.length; i++) {
             ns.gang.ascendMember(acensionGroup[i]);
        }
        for (let i = 0; i < trainGroup.length; i++) {
            ns.gang.setMemberTask(trainGroup[i], "Train Combat");
        }
        for (let i = 0; i < terroristGroup.length; i++) {
            ns.gang.setMemberTask(terroristGroup[i], "Terrorism");
        }
        for (let i = 0; i < crimeGroup.length; i++) {
            if (ns.gang.getGangInformation().territory > 0.5) {
                ns.gang.setMemberTask(crimeGroup[i], "Human Trafficking");
            } else {
                ns.gang.setMemberTask(crimeGroup[i], "Traffick Illegal Arms");
            }
        }

        for (let i = 0; i < warGroup.length; i++) {
            ns.gang.setMemberTask(crimeGroup[i], "Territory Warfare");
        }

    }
}
