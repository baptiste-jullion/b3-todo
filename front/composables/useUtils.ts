export default function useUtils() {
	const objectDiff = <T extends {}>(
		firstObject: T,
		secondObject: T,
	): Partial<T> => {
		const diff: Partial<T> = {};

		for (const key in firstObject) {
			if (firstObject[key] !== secondObject[key]) {
				diff[key] = firstObject[key];
			}
		}

		return diff;
	};

	const calculatePercentage = <T extends {}>(
		value: T[] | undefined,
		key: keyof T,
	) => {
		if (!value || !value.length) return null;
		const total = value.length;
		const completed = value.filter((item) => item[key]).length;

		return {
			total,
			completed,
      isCompleted: completed === total,
			percentage: (completed / total) * 100,
		};
	};

	return {
		objectDiff,
		calculatePercentage,
	};
}
