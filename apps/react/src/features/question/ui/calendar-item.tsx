import { cn } from '@ui/common/lib/utils'

interface CalendarItemProps {
  props: React.SVGProps<SVGSVGElement>
  date: string
  selected: boolean
}

const CalendarItem = ({ props, date, selected }: CalendarItemProps) => (
  <div className="relative flex h-fit w-fit items-center justify-center">
    {selected && <div className="absolute h-[68px] w-12 rounded-[10px] bg-neutral-100" />}

    <div className="relative z-10 flex flex-col items-center justify-center gap-1">
      <p className={cn('label1-medium text-gray-iron-500', { 'label1-semibold text-gray-iron-950': selected })}>
        {date}
      </p>

      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="M9.625 3.5L14 6.125L19.25 3.5L22.75 4.375L24.5 7L25.375 11.375L21.875 16.625L14 24.5L3.5 13.125L2.625 8.75L5.25 4.375L9.625 3.5Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.38712 4.5546C4.80927 3.13245 6.73812 2.3335 8.74935 2.3335C9.8929 2.3335 10.5306 2.35647 11.5498 2.80039C12.2648 3.11181 13.3373 3.99042 13.9998 4.55039C14.6624 3.99042 15.7348 3.11181 16.4498 2.80039C17.469 2.35647 18.1058 2.3335 19.2493 2.3335C21.2606 2.3335 23.1894 3.13245 24.6116 4.5546C26.0337 5.97675 26.8327 7.9056 26.8327 9.91683C26.8327 13.1156 24.7218 15.4621 22.9869 17.1625L15.0498 24.8504C14.5942 25.306 13.4054 25.306 12.9498 24.8504L5.01465 17.1654C3.25949 15.4679 1.16602 13.1245 1.16602 9.91683C1.16602 7.9056 1.96497 5.97675 3.38712 4.5546ZM8.74935 4.66683C7.35696 4.66683 6.0216 5.21995 5.03704 6.20452C4.05247 7.18908 3.49935 8.52444 3.49935 9.91683C3.49935 12.0715 4.90016 13.8094 6.64354 15.4947C6.64828 15.4993 6.65298 15.5039 6.65764 15.5085L13.9993 22.8502L21.3411 15.5085C21.3439 15.5057 21.3467 15.503 21.3495 15.5002C23.0904 13.7943 24.4993 12.0588 24.4993 9.91683C24.4993 8.52444 23.9462 7.18908 22.9617 6.20452C21.9771 5.21995 20.6417 4.66683 19.2493 4.66683C18.3396 4.66683 17.6314 4.79495 16.9765 5.0802C16.314 5.36873 15.6328 5.84995 14.8243 6.65845C14.3687 7.11407 13.63 7.11407 13.1744 6.65845C12.3659 5.84995 11.6847 5.36873 11.0222 5.0802C10.3673 4.79495 9.65913 4.66683 8.74935 4.66683Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
)

export default CalendarItem
