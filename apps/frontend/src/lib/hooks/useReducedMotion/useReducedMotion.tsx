"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@lib/providers";

export function useReducedMotion() {
	const { user, loading, updateUser } = useContext(AuthContext);
	const [reducedMotion, setReducedMotion] = useState(() => {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});

	const prevReducedMotionRef = useRef<boolean | null>(null);

	useEffect(() => {
		if (loading || user?.reducedMotion === undefined) return;

		if (user.reducedMotion !== reducedMotion) {
			setReducedMotion(user.reducedMotion);
		}
	}, [loading, user]);

	// class to disable animations and transitions
	const reducedMotionClass = "!animate-none !transition-none";

	useEffect(() => {
		if (loading || !user) return;

		// Only update the backend if the reducedMotion has changed
		if (prevReducedMotionRef.current !== reducedMotion) {
			updateUser({ reducedMotion });
			prevReducedMotionRef.current = reducedMotion;
		}

		if (reducedMotion) {
			document.documentElement.classList.add(...reducedMotionClass.split(" "));
		} else {
			document.documentElement.classList.remove(...reducedMotionClass.split(" "));
		}
	}, [reducedMotion, loading, user, updateUser]);

	return {
		reducedMotion,
		setReducedMotion,
	};
}
