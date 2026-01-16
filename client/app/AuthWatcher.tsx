"use client";

import { useEffect } from "react";
import { authActions } from "./store/auth";
import { userVerification } from "./lib/api";
import { useMyQuery } from "./hooks/use-query";
import { useAppDispatch } from "./hooks/use-store";

export default function AuthWatcher() {
  const dispatch = useAppDispatch();

  const { isSuccess } = useMyQuery({
    queryKey: ["userVerification"],
    queryFn: userVerification,
  });

  useEffect(() => {
    if (isSuccess) dispatch(authActions.login());
  }, [isSuccess, dispatch]);

  return null;
}
