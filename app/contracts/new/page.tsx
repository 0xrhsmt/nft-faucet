export default function NewPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-purple-700">New Contract</h1>
          <form className="space-y-4">
            <div>
              <label className="label">
                <span className="text-base label-text">Name</span>
              </label>
              <input type="text" placeholder="Name" className="w-full input input-bordered input-primary" />
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Symbol</span>
              </label>
              <input type="text" placeholder="Email Address" className="w-full input input-bordered input-primary" />
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Contract URI</span>
              </label>
              <input type="text" placeholder="Email Address" className="w-full input input-bordered input-primary" />
            </div>
            <div>
              <button className="btn btn-block btn-primary">Deploy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
