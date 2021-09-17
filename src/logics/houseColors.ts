export const houseColor = (house: string): string => {
  switch (house) {
    case 'Gryffindor':
      return 'bg-red-300 text-red-800';
    case 'Slytherin':
      return 'bg-green-300 text-green-800';
    case 'Ravenclaw':
      return 'bg-indigo-300 text-indigo-800';
    case 'Hufflepuff':
      return 'bg-yellow-300 text-yellow-800';
    default:
      return 'bg-blueGray-300 text-blueGray-800';
  }
}