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
	const [modalRef, animate] = useAnimate<HTMLDialogElement>();
	const modalStyles = twMerge(modalDefaultStyles, modalClassName);
	const styles = twMerge(defaultStyles, className);

	// always show modal if isOpen is true
	// parent handles unmounting
	useEffect(() => {
		const close = () => {
			if (reducedMotion) {
				onClose();
			} else {
				animate(modalRef.current, { opacity: 0, scale: 0.95 }).then(onClose);
			}
		};

		if (modalRef.current && isOpen) {
			modalRef.current.showModal();
			modalRef.current.addEventListener("close", close);
			// close on click outside
			modalRef.current.addEventListener("click", (e) => {
				if (e.target === modalRef.current) {
					close();
				}
			});
		}
		return () => {
			modalRef.current?.removeEventListener("close", close);
			modalRef.current?.removeEventListener("click", (e) => {
				if (e.target === modalRef.current) {
					close();
				}
			});
		};
	}, [isOpen, modalRef, reducedMotion, animate, onClose]);

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
