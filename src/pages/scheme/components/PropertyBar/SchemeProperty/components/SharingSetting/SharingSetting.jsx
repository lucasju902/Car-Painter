import React, { useMemo } from "react";
import { Formik } from "formik";

import { InnerForm } from "./InnerForm";

export const SharingSetting = React.memo((props) => {
  const {
    editable,
    ownerID,
    schemeID,
    currentUserID,
    userList,
    sharedUsers,
    onCancel,
    onApply,
  } = props;
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
        return {};
      }}
      onSubmit={onApply}
    >
      {(formProps) => (
        <InnerForm
          {...formProps}
          editable={editable}
          owner={owner}
          currentUserID={currentUserID}
          schemeID={schemeID}
          premiumUsers={premiumUsers}
          onCancel={onCancel}
        />
      )}
    </Formik>
  );
});
