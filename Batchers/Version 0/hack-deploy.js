/** @param {NS} ns */
export async function main(ns) {

    //Find all servers neighbor home
    let servershome = ns.scan("home");

    for (let i = 0; i < servershome.length; ++i) {
        const servertarget = servershome[i];
        let ramPerThread = ns.getScriptRam("hax-loop.js");
        await ns.scp("hax-loop.js", servertarget);

        let openPorts = 0;
        if (ns.fileExists("BruteSSH.exe")) {
            ns.brutessh(servertarget);
            openPorts++;
        }
        if (ns.fileExists("FTPCrack.exe")) {
            ns.ftpcrack(servertarget);
            openPorts++;
        }
        if (ns.fileExists("RelaySMTP.exe")) {
            ns.relaysmtp(servertarget);
            openPorts++;
        }
        if (ns.fileExists("HTTPWorm.exe")) {
            ns.httpworm(servertarget);
            openPorts++;
        }
        if (ns.fileExists("SQLInject.exe")) {
            ns.sqlinject(servertarget);
            openPorts++;
        }
        if (ns.getServerNumPortsRequired(servertarget) <= openPorts) {
            ns.nuke(servertarget);

        }
        if (ns.hasRootAccess) {
            let ramAvail = ns.getServerMaxRam(servertarget) - ns.getServerUsedRam(servertarget);
            let threads = Math.floor(ramAvail / ramPerThread);
            if (threads > 0) {
                ns.exec("hax-loop.js", servertarget, threads);
            } 
        }


    }
}
