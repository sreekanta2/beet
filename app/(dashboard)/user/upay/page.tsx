import Breadcrumb from "@/components/breadcumb";

export default function UpayPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <Breadcrumb
        items={[{ label: "dashboard", href: "/dashboard" }, { label: "Upay" }]}
      />
      <div className="w-full max-w-4xl mt-4 bg-white ">
        <h1>Upay</h1>

        {/* <div className="mt-6">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 shadow-sm text-sm px-4 py-1 rounded-sm"
          >
            Back
          </Button>
        </div> */}
      </div>
    </div>
  );
}
