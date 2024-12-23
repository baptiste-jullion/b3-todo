import { navigateTo } from "#app";

export default function useAuth() {
	const disconnect = async () => {
		localStorage.removeItem("access-token");
		navigateTo("/auth");
	};

	return {
		disconnect,
	};
}
