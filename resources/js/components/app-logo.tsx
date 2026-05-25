import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md shadow-none">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="grid flex-1 text-left">
                <span className="truncate leading-none font-normal text-[18px] tracking-[-0.11px] text-foreground">DevPorto</span>
            </div>
        </div>
    );
}
