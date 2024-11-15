"use client";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import type { ModalProps } from "./types";
import { motion, useAnimate } from "framer-motion";

const modalDefaultStyles = `
!m-0 !translate-x-[-50%] !translate-y-[-50%] top-1/2 left-1/2
p-0 border-0 backdrop:backdrop-blur-sm
rounded-lg shadow-lg
`;

const defaultStyles = `
p-4
bg-white dark:bg-gray-900
`;

export function Modal({
	reducedMotion,
	children,
	isOpen,
	className,
	onClose,
	modalClassName,
}: ModalProps) {
	const [modalRef, animate] = useAnimate();
	const modalStyles = twMerge(modalDefaultStyles, modalClassName);
	const styles = twMerge(defaultStyles, className);

	useEffect(() => {
		const closeOnClickOutside = (event: MouseEvent) => {
			if (event.target === modalRef.current) {
				reducedMotion
					? modalRef.current.close()
					: animate(modalRef.current, { opacity: 0, scale: 0.95 }).then(() =>
							modalRef.current.close(),
						);
			}
		};

		modalRef.current?.addEventListener("mousedown", closeOnClickOutside);
		modalRef.current?.addEventListener("close", onClose);

		return () => {
			modalRef.current?.removeEventListener("mousedown", closeOnClickOutside);
			modalRef.current?.removeEventListener("close", onClose);
		};
	}, [onClose, modalRef, animate, reducedMotion]);

	useEffect(() => {
		if (modalRef.current) {
			if (isOpen) {
				modalRef.current.showModal();
			} else {
				modalRef.current.close();
			}
		}
	}, [isOpen, modalRef]);

	return (
		<>
			{isOpen && (
				<motion.dialog
					initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					key="modal"
					ref={modalRef}
					className={modalStyles}
				>
					<div className={styles}>{children}</div>
				</motion.dialog>
			)}
		</>
	);
}
