import { runBuilderRole } from './role.builder';
import { runHarvesterRole } from './role.harvester';
import { runTransporterRole } from './role.transporter';
import { runUpgraderRole } from './role.upgrader';

export const runCreepController = (creep: Creep) => {
  switch (creep.memory.role) {
    case 'harvester':
      runHarvesterRole(creep);
      break;
    case 'transporter':
      runTransporterRole(creep);
      break;
    case 'upgrader':
      runUpgraderRole(creep);
      break;
    case 'builder':
      runBuilderRole(creep);
      break;
  }
};
