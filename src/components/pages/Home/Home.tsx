import { Link } from "react-router-dom"
import Button from "../../ui/Button"

const Home = () => {
    return(
        <main className="flex justify-center items-center flex-col h-screen gap-6">
            <h1 className="text-4xl text-black font-bold">Welcome To WPU Cafe</h1>
            <Link to="/login">
                <Button color="primary" type="button" >Go to Menu</Button>
            </Link>
        </main>
    )
}

export default Home;