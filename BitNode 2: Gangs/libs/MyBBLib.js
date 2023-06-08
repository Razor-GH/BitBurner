/** @param {NS} ns */
export async function main(ns) {
}
/** @param {NS} ns */
export function testImporter(ns) {
    let something = "Yes";
    return (something);
}
/** @param {NS} ns */
export function unlockScanServers(ns) {
    let servers = [];
    let serversToScan = ns.scan("home");
    while (serversToScan.length > 0) {
        let server = serversToScan.shift();
        if (!servers.includes(server) && server !== "home") {
            servers.push(server);
            serversToScan = serversToScan.concat(ns.scan(server));
             ns.scp([
                "/shared/weaken.js",
                "/shared/grow.js",
                "/shared/hack.js"
            ], server);

            let openPorts = 0;
            if (ns.fileExists("BruteSSH.exe")) {
                ns.brutessh(server);
                openPorts++;
            }
            if (ns.fileExists("FTPCrack.exe")) {
                ns.ftpcrack(server);
                openPorts++;
            }
            if (ns.fileExists("RelaySMTP.exe")) {
                ns.relaysmtp(server);
                openPorts++;
            }
            if (ns.fileExists("HTTPWorm.exe")) {
                ns.httpworm(server);
                openPorts++;
            }
            if (ns.fileExists("SQLInject.exe")) {
                ns.sqlinject(server);
                openPorts++;
            }
            if (ns.getServerNumPortsRequired(server) <= openPorts) {
                ns.nuke(server);
            }
        }
    }
    return(servers);
}
