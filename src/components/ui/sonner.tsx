import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .toaster {
            bottom: 0 !important;
            top: auto !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            width: 100vw !important;
            max-width: 100vw !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    </>
  )
}

export { Toaster, toast }
