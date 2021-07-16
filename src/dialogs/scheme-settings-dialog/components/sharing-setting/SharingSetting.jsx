import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";

import { InnerForm } from "./inner-form";

export const SharingSetting = React.memo((props) => {
  const { ownerID, schemeID, userList, sharedUsers, onCancel, onApply } = props;
  const owner = useMemo(() => userList.find((item) => item.id === ownerID), [
    ownerID,
    userList,
  ]);
  const premiumUsers = useMemo(() => userList.filter((item) => item.pro_user), [
    userList,
  ]);
  const initialValues = useMemo(
    () => ({
      newUser: null,
      sharedUsers: sharedUsers,
    }),
    [sharedUsers]
  );

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={Yup.object().shape({
      //   user_id: Yup.number().min(0),
      // })}
      validate={(values) => {
        console.log(values);
        return {};
      }}
      onSubmit={onApply}
    >
      {(formProps) => (
        <InnerForm
          {...formProps}
          owner={owner}
          schemeID={schemeID}
          premiumUsers={premiumUsers}
          onCancel={onCancel}
        />
      )}
    </Formik>
  );
});
