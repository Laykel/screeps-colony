import { transferToSpawn } from './shared.logic';

// Go to closest source
// If mode = container, bring to container
// If container is within one block of source, activate container mining mode
// Have transporter bring the energy to the spawn and extensions, then the main container

export const runMinerRole = (creep: Creep) => {
  if (creep.store.getFreeCapacity() > 0 && creep.memory.sourceId) {
    const source = Game.getObjectById(creep.memory.sourceId);

    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    if (Memory.mode === 'game_start') {
      transferToSpawn(creep);
    }
  }
};
