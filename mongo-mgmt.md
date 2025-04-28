## Updating the cluster mongo instance

1. Back up the cluster database:

```bash
kubectl exec --namespace=$KUBE_NS $KUBE_POD -- mongodump "mongodb://$USER:$PASSWORD@localhost:27017" --gzip --archive > dump.gz
```

2. Bump `image.tag` in the relevant [values.yaml](charts/mongo/values.yaml) to the desired image version

3. Bring the updated version from the subchart into the top-level chart

```bash
cd charts/madmeme
helm dependency update
```

4. Push the changes to the main branch in Github, push a tag for the new build, and manually execute the `deploy` GHA workflow.

5. (Optional) If data loss has occurred and restoration is necessary:

```bash
cat dump.gz | kubectl exec -i --namespace=$KUBE_NS $KUBE_POD -- mongorestore "mongodb://$USER:$PASSWORD@localhost:27017" --gzip --archive
```
