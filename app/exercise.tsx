const [rest, setRest] = useState<RestPeriod>({inSet: true, clock: 180});
const minutes = Math.floor(rest.clock / 60);
const seconds = rest.clock % 60;

useEffect(() => {
  let interval: any;

  // ΕΛΕΓΧΟΣ: Πρέπει να τρέξει το ρολόι;
  if (!rest.inSet && rest.clock > 0) {
    interval = setInterval(() => {
      // Εδώ πρέπει να μειώσουμε το clock...
    }, 1000);
  }

  // Αυτό είναι το "καθάρισμα" (Cleanup) για να μην τρελαθεί το κινητό
  return () => clearInterval(interval);

}, [rest.inSet, rest.clock]); // Οι "κατάσκοποι": Τρέξε το effect αν αλλάξει κάποιο από αυτά