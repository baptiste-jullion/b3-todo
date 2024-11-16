export default function useUtils() {
	const objectDiff = <T extends {}>(firstObject: T, secondObject: T): Partial<T> => {
    const diff: Partial<T> = {};

    for (const key in firstObject) {
      if (firstObject[key] !== secondObject[key]) {
        diff[key] = firstObject[key];
      }
    }

    return diff;
	};

	return {
		objectDiff,
	};
}
