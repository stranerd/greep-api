type ToastArgs = {
	message: string
}

export const Notify = async (args: ToastArgs) => {
	await window.alert(args.message)
}

type AlertArgs = ToastArgs & {
	confirmButtonText: string
	cancelButtonText?: string
}

export const Alert = async (args: AlertArgs) => {
	return window.confirm(args.message)
}
