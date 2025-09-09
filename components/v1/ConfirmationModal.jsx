import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Spinner } from "../ui/shadcn-io/spinner";

export default function ConfirmationModal({
  title,
  description,
  confirmAction,
  closeAction,
  loading,
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50">
      <Card className="fixed w-5/6 h-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3">
        <CardHeader className="flex w-full items-center justify-center text-xl mb-3">
          <CardTitle className="mb-5">{title}</CardTitle>
          <CardDescription className="flex flex-col w-full items-center justify-center text-center gap-2">
            <p>{description}</p>
            <p className="font-bold">Are you sure?</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex w-full items-center justify-center gap-5">
              <Spinner />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-5">
              <Button
                variant="destructive"
                className="w-20"
                onClick={() => closeAction()}
              >
                No
              </Button>
              <Button
                variant=""
                className="w-20"
                onClick={() => confirmAction()}
              >
                Yes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
