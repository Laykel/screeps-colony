export const runLinkController = (link: StructureLink) => {
  if (link.cooldown === 0 && link.store.getFreeCapacity() === 0) {
    link.transferEnergy(link); // TODO
  }
};
