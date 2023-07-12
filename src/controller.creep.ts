import { runBuilderRole } from './role.builder';
import { runHarvesterRole } from './role.harvester';
import { runMinerRole } from './role.miner';
import { runOperatorRole } from './role.operator';
import { runTransporterRole } from './role.transporter';
import { runUpgraderRole } from './role.upgrader';

export const runCreepController = (creep: Creep) => {
  switch (creep.memory.role) {
    case 'miner':
      runMinerRole(creep);
      break;
    case 'transporter':
      runTransporterRole(creep);
      break;
    case 'operator':
      runOperatorRole(creep);
      break;
    case 'upgrader':
      runUpgraderRole(creep);
      break;
    case 'builder':
      runBuilderRole(creep);
      break;
    case 'harvester':
      runHarvesterRole(creep);
      break;
  }
};
