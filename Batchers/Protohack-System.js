/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");

  let target = ns.args[0];
  let s = ns.args[1];
  let servers = [];
  let ramNet = [];
  let ramPerThread = ns.getScriptRam("/shared/weaken.js");
  let mePlayer = ns.getPlayer();
  let delay = 0;

  //giant ass calculations
  ns.print("Big Calculations!!!");
  let moneyThresh = ns.getServerMoneyAvailable(target) * 0.55;
  let perHackThread = ns.hackAnalyze(target) * ns.getServerMoneyAvailable(target);
  let threadsForHack = Math.floor(moneyThresh / perHackThread);

  let threadsForGrow = ns.formulas.hacking.growThreads(ns.getServer(target), mePlayer, ns.getServerMaxMoney(target));

  let currentsecurityIncrease = ns.getServerSecurityLevel(target) + ns.hackAnalyzeSecurity(threadsForHack, target) + ns.growthAnalyzeSecurity(threadsForGrow, target);
  let securityDecrease = ns.weakenAnalyze(1);
  let threadsForWeaken = Math.floor(currentsecurityIncrease / securityDecrease);

  ns.print("Weaken Threads: " + threadsForWeaken);
  ns.print("Hack Threads: " + threadsForHack);
  ns.print("Grow Threads: " + threadsForGrow);
  //Now we just need to schedule them correctly
  //Batch timings
  let timeHack = ns.getHackTime(target);
  let timeGrow = timeHack * 3.2;
  let timeWeaken = timeHack * 4;

  let epsilon = 1000000;
  // you wanna also find the best server for all of this by trying to record each server level. Then finding the one closest to half my current hack level
  // this part is just to scan for the servers and nuke all of them
  let totalScriptRam = 0;

  let serversToScan = ns.scan("home");
  ns.print("scanning servers..." + serversToScan.length);

  while (serversToScan.length > 0) {
    let server = serversToScan.shift();
    // && server !== "home"
    if (!servers.includes(server)) {
      servers.push(server);
      serversToScan = serversToScan.concat(ns.scan(server));
      await ns.scp([
        "/shared/weaken.js",
        "/shared/grow.js",
        "/shared/hack.js"
      ], server);
      let totalthreads = threadsForGrow + threadsForHack + threadsForWeaken;
      let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
      totalScriptRam = ns.getScriptRam("/shared/weaken.js", server) * totalthreads;

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

        if (ramAvailable >= totalScriptRam) {
          ramNet.push(server);
          ns.print("Added")
        }
      }
    }
  }
  ns.print("Servers:" + servers);
  ns.print("Total Script Ram " + totalScriptRam);
  ns.print("server unlocked!");
  ns.print("RAMNET" + ramNet);
  ns.print("Added server to RamNet successfully");
  //actually trying to run them but probably failing misserably
  if (ramNet.length != 0) {
    while (true) {
      ns.print("Big Calculations!!!");


      ns.print("Weaken Threads: " + threadsForWeaken);
      ns.print("Hack Threads: " + threadsForHack);
      ns.print("Grow Threads: " + threadsForGrow);

      if (threadsForWeaken != 0 || threadsForWeaken != Infinity) {
        ns.print("Weakening");
        ns.exec("/shared/weaken.js", ramNet[s], threadsForWeaken, target);
        delay = Math.floor(timeWeaken - timeGrow);

      } else {
        ns.print("No Weaken :(");
        delay = Math.floor(timeWeaken - timeGrow);
      }
      ns.print("Delay: " + delay);
      await ns.sleep(delay);
      if (threadsForGrow != 0 || threadsForGrow != Infinity) {
        ns.print("Growing")
        ns.exec("/shared/grow.js", ramNet[s], threadsForGrow, target);
        delay = Math.floor(timeGrow - timeHack);

      } else if (!(Math.floor(ns.getServerMoneyAvailable(target) - ns.getServerMaxMoney(target)) <= epsilon || ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target))) {
        ns.alert("Server money is empty or cannot grow. Server Terminated")
        ns.scriptKill("batchers/protohack-system.js");
      } else {
        ns.print("No Grow :(");
        delay = Math.floor(timeGrow - timeHack);
      }
      ns.print("Delay: " + delay);
      await ns.sleep(delay + 1000);
      ns.print("Hacking");
      ns.exec("/shared/hack.js", ramNet[s], threadsForHack, target);

      ns.print("Chill Time: " + timeHack);
      await ns.sleep(timeHack);

    }
  }
}
/** @param {NS} ns **/
function FindBestTarget(ns,) {

}
