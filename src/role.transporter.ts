import { transferToStructures, withdrawFromContainer } from './shared.logic';

export const runTransporterRole = (creep: Creep) => {
  if (Memory.mode !== 'container') return;

  if (creep.store.getFreeCapacity() > 0) {
    withdrawFromContainer(creep);
  } else {
    transferToStructures(creep);
  }
};
