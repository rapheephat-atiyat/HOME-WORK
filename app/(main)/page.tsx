import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex p-4 text-center border border-black/10 rounded-lg">
      <div className="w-2/5">
        <div>
          <img src="/me.gif" alt="" className="w-full h-96 object-cover rounded-t-lg" />
        </div>
        <div className="border border-black/10 rounded-b-lg text-start p-2">
          <h5 className="font-bold text-md">Rapheephat atiyat</h5>
          <p className="text-xs">Computer Science and Software Development</p>
          <p>School of Information Technology <span className="font-bold">(SIT)</span></p>
          <p>Sripatum University <span className="font-bold">(SPU)</span></p>
        </div>
      </div>
      <div className="flex-1 text-start px-2">
        <h5 className="font-bold text-md">
          My Future Career Goal: Frontend Developer
        </h5>

        <ul className="list-disc list-outside text-md my-2 ml-5">
          <li>
            <span className="font-bold">My Goal:</span>{" "}
            I want to become a Frontend Developer because I enjoy
            creating websites and designing web pages.
          </li>

          <li>
            <span className="font-bold">My Skills:</span>{" "}
            I am learning HTML, CSS, JavaScript, and React.
            I want to improve my coding skills and learn more
            about web development.
          </li>

          <li>
            <span className="font-bold">My Interests:</span>{" "}
            I like designing websites and making them look
            nice and easy to use.
          </li>

          <li>
            <span className="font-bold">My Future Plan:</span>{" "}
            I hope to work as a Frontend Developer,
            gain more experience, and become better at coding.
          </li>
        </ul>
        <h5 className="font-bold text-md">I hope you enjoy this course :)</h5>
        <img src="/coding.png" />
      </div>
    </main >
  );
}
