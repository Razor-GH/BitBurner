import { testImporter, unlockScanServers } from "/libs/MyBBLib.js";
/** @param {NS} ns */
export async function main(ns) {
    //ns.tprint(testImporter(ns));
    //ns.tprint(unlockScanServers(ns));

    let servers = unlockScanServers(ns);
    let myservs = ns.getPurchasedServers()
    servers = servers.filter(num => num !== myservs);
    for (let server of servers) {
        ns.run("Batchers/protohack-system.js", 1, server, 0);
    }
}
