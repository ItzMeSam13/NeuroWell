
import NavigationBar from "@/components/home/Navigation";

export default function HomeLayout({ children }) {
	return (
		<>
			<header className='shadow-sm bg-white sticky top-0 z-50'>
				<NavigationBar />
			</header>

			<main className='flex-grow'>{children}</main>

			<footer className='border-t py-4 text-center text-sm text-black bg-gray-50'>
				<p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
			</footer>
		</>
	);
}
