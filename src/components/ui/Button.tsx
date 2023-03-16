import { cva, VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes } from "react"

export const buttonStyles = cva("relative rounded text-center", {
  variants: {
    variant: {
      primary: "text-black border bg-violet",
      secondary: "border",
      unemphasized: "text-violet hover:opacity-90",
      tertiary: "bg-gray-90 text-white hover:bg-gray-90/80",
    },
    size: {
      sm: "px-3 py-1 text-sm font-medium",
      base: "font-medium px-3 py-1 text-base",
      lg: "font-medium font-bold px-5 py-2 text-base rounded-lg",
      xl: "px-16 py-3 font-bold text-xl",
    },
    fullWidth: {
      true: "w-full",
      false: "w-fit",
    },
    disabled: {
      true: "cursor-not-allowed",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      disabled: false,
      class: "hover:bg-violet/80",
    },
    {
      variant: "primary",
      disabled: true,
      class: "opacity-70",
    },
    {
      variant: "secondary",
      disabled: false,
      class: "text-white border-white hover:border-gray-40 hover:text-gray-40",
    },
    {
      variant: "secondary",
      disabled: true,
      class: "text-gray-80 border-gray-80",
    },
    {
      variant: "unemphasized",
      disabled: false,
      class: "text-violet hover:text-violet/80 ",
    },
    {
      variant: "unemphasized",
      disabled: true,
      class: "text-violet/20",
    },
  ],
})

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof buttonStyles> {
  children: React.ReactNode
  loading?: boolean
}

export const Button = ({
  children,
  variant = "primary",
  size = "base",
  fullWidth = false,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonStyles({
        variant,
        size,
        fullWidth,
        disabled: disabled || loading,
      })}
      disabled={Boolean(disabled || loading)}
      {...props}
    >
      <>
        <span className={loading ? "text-transparent" : ""}>{children}</span>
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.7336 1.63917C6.97513 2.54072 7.17265 3.28657 7.17252 3.29662C7.17237 3.30746 7.12041 3.31944 7.04479 3.32608C6.71033 3.35544 6.20267 3.48915 5.84205 3.64287C5.74828 3.68284 5.66823 3.71221 5.66416 3.70815C5.66009 3.70408 5.45827 2.96237 5.21567 2.05989C4.88978 0.847545 4.77943 0.414324 4.79313 0.400991C4.81099 0.383617 6.22558 1.8659e-07 6.27179 1.9063e-07C6.28793 1.92041e-07 6.42052 0.470596 6.7336 1.63917ZM11.3013 0.954147C11.6587 1.16117 11.9529 1.33991 11.9551 1.35135C11.9599 1.37577 10.2757 4.29357 10.2524 4.30135C10.2437 4.30425 10.1967 4.27425 10.1479 4.23468C9.82671 3.97396 9.38244 3.71967 8.99414 3.57428C8.95116 3.55818 8.916 3.53903 8.916 3.53172C8.916 3.5244 9.07964 3.23516 9.27966 2.88896C9.74079 2.09081 10.1994 1.29759 10.4346 0.891479C10.5354 0.717496 10.6254 0.575732 10.6347 0.576445C10.6439 0.577155 10.9439 0.747124 11.3013 0.954147ZM14.6909 5.08184C14.7301 5.22871 14.8192 5.55962 14.8888 5.81721C14.9827 6.16483 15.0105 6.29011 14.9966 6.30324C14.9773 6.32147 11.7746 7.18159 11.7271 7.1813C11.706 7.18116 11.6983 7.15523 11.6894 7.05378C11.6606 6.72636 11.4827 6.06144 11.3584 5.81627C11.3102 5.7214 11.3076 5.69101 11.3465 5.67926C11.4723 5.64126 14.5803 4.81481 14.5975 4.81481C14.6122 4.81481 14.6435 4.90412 14.6909 5.08184ZM3.29438 7.84934C3.29881 7.8569 3.30752 7.91485 3.31374 7.97812C3.34611 8.30736 3.52285 8.96411 3.64264 9.20025C3.66415 9.24265 3.68429 9.29111 3.6874 9.30795C3.69247 9.33537 3.52163 9.38447 2.04806 9.77907C1.14331 10.0214 0.398056 10.2144 0.39194 10.2081C0.377388 10.193 -4.10381e-07 8.78545 -4.06954e-07 8.74625C-4.04683e-07 8.72027 0.219345 8.65745 1.61623 8.28331C2.50516 8.04523 3.24458 7.84709 3.25939 7.84301C3.2742 7.83892 3.28995 7.84177 3.29438 7.84934ZM12.971 9.75446C13.7762 10.2196 14.435 10.6062 14.435 10.6136C14.435 10.6326 13.665 11.9631 13.6543 11.9628C13.6332 11.962 10.7178 10.2721 10.7131 10.2579C10.7102 10.2492 10.7402 10.2023 10.7798 10.1536C11.0407 9.83288 11.2657 9.4425 11.4362 9.01458C11.4576 8.96101 11.4822 8.91528 11.491 8.91296C11.4997 8.91065 12.1657 9.28932 12.971 9.75446ZM4.88704 10.8099C5.20316 11.0606 5.56277 11.2672 5.95496 11.4234C6.02282 11.4504 6.08444 11.4785 6.09189 11.4857C6.10234 11.4958 4.45738 14.3755 4.40834 14.4329C4.39793 14.4451 3.12885 13.7262 3.07812 13.6793C3.05907 13.6618 3.19228 13.4213 3.89855 12.1986C4.3623 11.3957 4.74696 10.7331 4.75337 10.726C4.75977 10.7189 4.81992 10.7567 4.88704 10.8099ZM9.33563 11.3427C9.3573 11.4033 10.1991 14.5619 10.1991 14.5826C10.1991 14.597 10.1736 14.6143 10.1374 14.6243C9.65744 14.7577 8.70013 15.0066 8.69338 14.9999C8.67688 14.9834 7.81316 11.742 7.82031 11.7234C7.82422 11.7133 7.88543 11.6998 7.95634 11.6936C8.28433 11.6648 8.80408 11.5295 9.13807 11.3859C9.2983 11.317 9.3244 11.3113 9.33563 11.3427Z"
                className="fill-current"
              />
            </svg>
          </div>
        )}
      </>
    </button>
  )
}
